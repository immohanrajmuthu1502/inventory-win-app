import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { normalizeAppSettings } from "../utils/appSettings";

const Settings = ({ products, bills, settings, setSettings }) => {
  const [draft, setDraft] = useState(normalizeAppSettings(settings));

  useEffect(() => {
    setDraft(normalizeAppSettings(settings));
  }, [settings]);

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    setSettings(normalizeAppSettings(draft));
    alert("Settings saved. Please restart the application to apply everywhere.");
  };

  const handleChooseExportFolder = async () => {
    if (!window.electronAPI?.selectExportFolder) {
      alert("Folder selection is available only in the desktop app.");
      return;
    }

    const folder = await window.electronAPI.selectExportFolder();
    if (folder) updateDraft("exportPath", folder);
  };

  const handleLogoUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => updateDraft("billLogo", e.target.result);
    reader.readAsDataURL(file);
  };

  // Export Backup
  const handleExport = async () => {
    let backup;

    if (window.electronAPI?.getData) {
      const products = await window.electronAPI.getData("products");
      const bills = await window.electronAPI.getData("bills");
      const settings = await window.electronAPI.getData("settings");

      backup = { products, bills, settings, date: new Date().toISOString() };
    } else {
      backup = {
        products,
        bills,
        settings,
        date: new Date().toISOString(),
      };
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${Date.now()}.json`;
    a.click();
  };

  // Import Backup
  const handleImport = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (window.electronAPI?.setData) {
          await window.electronAPI.setData("products", data.products || []);
          await window.electronAPI.setData("bills", data.bills || []);
          await window.electronAPI.setData(
            "settings",
            normalizeAppSettings(data.settings),
          );
        } else {
          localStorage.setItem("products", JSON.stringify(data.products || []));
          localStorage.setItem("bills", JSON.stringify(data.bills || []));
          localStorage.setItem(
            "settings",
            JSON.stringify(normalizeAppSettings(data.settings)),
          );
        }

        alert("Backup restored successfully!");
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file");
      }
    };

    reader.readAsText(file);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <Box
          sx={{
            mt: 2,
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            maxWidth: 520,
            flex: 1,
          }}
        >
          <Typography variant="h6">Shop Details</Typography>

          <TextField
            fullWidth
            label="Shop Name"
            value={draft.shopName}
            onChange={(e) => updateDraft("shopName", e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Shop Address"
            value={draft.shopAddress}
            onChange={(e) => updateDraft("shopAddress", e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={draft.shopEmail}
            onChange={(e) => updateDraft("shopEmail", e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={draft.shopPhone}
            onChange={(e) => updateDraft("shopPhone", e.target.value)}
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label">
              Upload App Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleLogoUpload(e.target.files[0])}
              />
            </Button>
            {draft.billLogo && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={draft.billLogo}
                  alt="Bill logo preview"
                  style={{ maxWidth: 160, maxHeight: 80, objectFit: "contain" }}
                />
              </Box>
            )}
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            maxWidth: 520,
            flex: 1,
          }}
        >
          <Typography variant="h6">Export Location</Typography>
          <TextField
            fullWidth
            label="Invoice / Reports Save Folder"
            value={draft.exportPath}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
            placeholder="Default browser downloads folder"
          />
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleChooseExportFolder}
          >
            Select Folder
          </Button>
          <Typography sx={{ mt: 1, fontSize: 12, color: "#777" }}>
            Folder saving works in the desktop app. Browser mode will continue
            to use normal downloads.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 3,
          p: 3,
          border: "1px solid #ddd",
          borderRadius: 2,
          maxWidth: 520,
        }}
      >
        <Typography variant="h6">Backup & Restore</Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleExport}
        >
          Export Backup
        </Button>

        <Button fullWidth variant="outlined" component="label" sx={{ mt: 2 }}>
          Import Backup
          <input
            type="file"
            hidden
            accept="application/json"
            onChange={(e) => handleImport(e.target.files[0])}
          />
        </Button>

        <Typography sx={{ mt: 2, fontSize: 12, color: "#777" }}>
          Please keep backup file safe. Import will overwrite existing data.
        </Typography>
      </Box>
    </Box>
  );
};

export default Settings;
