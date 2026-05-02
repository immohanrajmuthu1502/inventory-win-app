import React from "react";
import { Box, Typography, Button } from "@mui/material";

const Settings = ({ products, bills }) => {
  // 📤 Export Backup
  const handleExport = async () => {
    let backup;

    if (window.electronAPI?.getData) {
      const products = await window.electronAPI.getData("products");
      const bills = await window.electronAPI.getData("bills");

      backup = { products, bills, date: new Date().toISOString() };
    } else {
      backup = {
        products,
        bills,
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

  // 📥 Import Backup
  const handleImport = (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (window.electronAPI?.setData) {
          // 🖥 Electron → save to config.json
          await window.electronAPI.setData("products", data.products || []);
          await window.electronAPI.setData("bills", data.bills || []);
        } else {
          // 🌐 Browser → save to localStorage
          localStorage.setItem("products", JSON.stringify(data.products || []));
          localStorage.setItem("bills", JSON.stringify(data.bills || []));
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
        ⚙ Settings
      </Typography>

      <Box
        sx={{
          mt: 2,
          p: 3,
          border: "1px solid #ddd",
          borderRadius: 2,
          maxWidth: 400,
        }}
      >
        <Typography variant="h6">Backup & Restore</Typography>

        {/* Export */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleExport}
        >
          📤 Export Backup
        </Button>

        {/* Import */}
        <Button fullWidth variant="outlined" component="label" sx={{ mt: 2 }}>
          📥 Import Backup
          <input
            type="file"
            hidden
            accept="application/json"
            onChange={(e) => handleImport(e.target.files[0])}
          />
        </Button>

        {/* Info */}
        <Typography sx={{ mt: 2, fontSize: 12, color: "#777" }}>
          ⚠ Please keep backup file safe. Import will overwrite existing data.
        </Typography>
      </Box>
    </Box>
  );
};

export default Settings;
