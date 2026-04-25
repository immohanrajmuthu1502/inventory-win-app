import React, { useState, useMemo, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import { getBestPriceWithBreakdown } from "../utils/pricingUtils";

const defaultPacks = { 2: "", 3: "", 5: "", 10: "" };

const Pricing = ({ products, setProducts }) => {
  const [selectedId, setSelectedId] = useState("");
  const [single, setSingle] = useState("");
  const [packs, setPacks] = useState(defaultPacks);
  const [previewQty, setPreviewQty] = useState(1);
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedId),
    [products, selectedId],
  );

  useEffect(() => {
    if (!selectedProduct) return;

    const pricing = selectedProduct.pricing;

    if (pricing) {
      setSingle(pricing.single || "");
      setPacks({
        2: pricing.packs?.[2] || "",
        3: pricing.packs?.[3] || "",
        5: pricing.packs?.[5] || "",
        10: pricing.packs?.[10] || "",
      });
    } else {
      // reset if no pricing
      setSingle("");
      setPacks(defaultPacks);
    }
  }, [selectedProduct]);

  const handlePackChange = (size, value) => {
    setPacks((prev) => ({ ...prev, [size]: value }));
  };

  const singlePrice = Number(single || 0);

  const handleSave = () => {
    if (!selectedProduct) return;

    const pricing = {
      single: singlePrice,
      packs: Object.fromEntries(
        Object.entries(packs).map(([k, v]) => [k, Number(v || 0)]),
      ),
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, pricing } : p)),
    );

    alert("Pricing saved!");
  };

  const preview = getBestPriceWithBreakdown(previewQty, {
    single: singlePrice,
    packs: Object.fromEntries(
      Object.entries(packs).map(([k, v]) => [k, Number(v || 0)]),
    ),
  });

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pricing
      </Typography>

      {/* Product Select */}
      <TextField
        select
        label="Select Product"
        fullWidth
        margin="normal"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {products.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Single Price"
        type="number"
        fullWidth
        margin="normal"
        value={single}
        onChange={(e) => setSingle(e.target.value)}
      />

      {/* Pack Pricing */}
      <Typography sx={{ mt: 3 }}>Pack Pricing</Typography>

      {Object.keys(packs).map((size) => (
        <TextField
          key={size}
          label={`Pack ${size}`}
          type="number"
          fullWidth
          margin="normal"
          value={packs[size]}
          onChange={(e) => handlePackChange(size, e.target.value)}
        />
      ))}

      <Typography sx={{ mt: 3 }}>Preview</Typography>

      <TextField
        label="Quantity"
        type="number"
        fullWidth
        margin="normal"
        value={previewQty}
        onChange={(e) => setPreviewQty(Number(e.target.value || 1))}
      />

      <Typography sx={{ mt: 2 }}>
        <b>Total Price:</b> ₹{preview.total}
      </Typography>

      <Typography>
        <b>Breakdown:</b> {preview.breakdown || "-"}
      </Typography>

      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSave}>
        Save Pricing
      </Button>
    </Box>
  );
};

export default Pricing;
