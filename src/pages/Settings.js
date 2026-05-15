import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { normalizeAppSettings } from "../utils/appSettings";

const Settings = ({ products, bills, settings, setSettings }) => {
  const [draft, setDraft] = useState(normalizeAppSettings(settings));
  const [newCategory, setNewCategory] = useState("");
  const [currentStoragePath, setCurrentStoragePath] = useState("");
  const [selectedStoragePath, setSelectedStoragePath] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    setDraft(normalizeAppSettings(settings));
  }, [settings]);

  // Fetch current storage path on component mount
  useEffect(() => {
    const getStoragePath = async () => {
      if (window.electronAPI?.invoke) {
        try {
          const path = await window.electronAPI.invoke("get-current-storage-path");
          setCurrentStoragePath(path);
        } catch (err) {
          console.error("Error fetching storage path:", err);
        }
      }
    };
    getStoragePath();
  }, []);

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !draft.categories.includes(newCategory)) {
      setDraft((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (category) => {
    if (category === "No Category") {
      alert("Cannot delete the default category");
      return;
    }
    setDraft((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
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

  const handleSelectDataStorageFolder = async () => {
    if (!window.electronAPI?.invoke) {
      alert("Custom data storage location is available only in the desktop app.");
      return;
    }

    try {
      const folder = await window.electronAPI.invoke(
        "select-data-storage-folder"
      );
      if (folder) {
        setSelectedStoragePath(folder);
      }
    } catch (err) {
      alert("Error selecting folder: " + err.message);
    }
  };

  const handleMigrateDataStorage = async () => {
    if (!selectedStoragePath) {
      alert("Please select a folder first");
      return;
    }

    if (
      !window.confirm(
        "This will move all your data (products, bills, settings) to the new location. Continue?"
      )
    ) {
      return;
    }

    setIsMigrating(true);
    try {
      const result = await window.electronAPI.invoke(
        "migrate-data-to-location",
        selectedStoragePath
      );

      if (result.success) {
        alert(result.message);
        setSelectedStoragePath("");
        setCurrentStoragePath(selectedStoragePath);
      } else {
        alert("Migration failed: " + result.message);
      }
    } catch (err) {
      alert("Error migrating data: " + err.message);
    } finally {
      setIsMigrating(false);
    }
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          <Box
            sx={{
              mt: 2,
              p: 3,
              border: "1px solid #ddd",
              borderRadius: 2,
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
          </Box>

          <Box
            sx={{
              p: 3,
              border: "1px solid #ddd",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">Product Categories</Typography>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: 14, mb: 1 }}>Current Categories:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {draft.categories.map((category) => (
                  <Box
                    key={category}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 0.5,
                      backgroundColor: "#e3f2fd",
                      borderRadius: 1,
                      border: "1px solid #90caf9",
                    }}
                  >
                    <Typography sx={{ fontSize: 14 }}>{category}</Typography>
                    {category !== "No Category" && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(category)}
                        sx={{ ml: 1, p: 0 }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                size="small"
                sx={{ flex: 1 }}
                placeholder="e.g., Shorts, Tops"
              />
              <Button variant="outlined" onClick={handleAddCategory}>
                Add
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          <Box
            sx={{
              mt: 2,
              p: 3,
              border: "1px solid #ddd",
              borderRadius: 2,
              maxWidth: 520,
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

          <Box
            sx={{
              p: 3,
              border: "1px solid #ddd",
              borderRadius: 2,
              maxWidth: 520,
            }}
          >
            <Typography variant="h6">Data Storage Location</Typography>
            <TextField
              fullWidth
              label="Current Storage Path"
              value={currentStoragePath}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
              placeholder="Default app data folder"
              size="small"
            />
            <Typography sx={{ mt: 1, fontSize: 12, color: "#777" }}>
              This is where your products, bills, and settings are stored.
            </Typography>

            {selectedStoragePath && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  Selected new location:
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#666", mt: 0.5 }}>
                  {selectedStoragePath}
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={handleSelectDataStorageFolder}
            >
              Choose New Storage Location
            </Button>

            {selectedStoragePath && (
              <Button
                fullWidth
                variant="contained"
                color="warning"
                sx={{ mt: 2 }}
                onClick={handleMigrateDataStorage}
                disabled={isMigrating}
              >
                {isMigrating ? "Migrating..." : "Migrate Data to New Location"}
              </Button>
            )}

            <Typography sx={{ mt: 2, fontSize: 12, color: "#777" }}>
              ⚠️ Desktop app feature only. This allows you to store your data on
              an external drive, cloud sync folder, or custom location.
            </Typography>
          </Box>

          <Box
            sx={{
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
      </Box>

      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSaveSettings}
          sx={{ minWidth: 200 }}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
