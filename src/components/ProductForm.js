import React, { useState, useEffect } from "react";

const ProductForm = ({ onAdd, editingProduct  }) => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    quantity: "",
    shipping: "",
    packaging: "", 
    margin: "",
    buffer: "",
    offerPercentage: "",
    extraDiscount: "",
    customPrice: "",
  });

  useEffect(() => {
  if (editingProduct) {
    const { pricing, finalPrice, ...rest } = editingProduct;
    setProduct(rest);
  }
}, [editingProduct]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({  ...product,
             pricing: prices,
             finalPrice: product.customPrice || prices.online, 
             profit: profits, packPricing: packPricing,
             packProfit});
    setProduct({
      name: "",
      category: "",
      quantity: "",
      purchasePrice: "",
      shipping: "",
      packaging: "",
      margin: "",
      buffer: "",
      offerPercentage: "",
      extraDiscount: "",
      customPrice:"",
    });
  };
  
  const calculatePrices = (product) => {
  const base =
    Number(product.purchasePrice || 0) +
    Number(product.shipping || 0) +
    Number(product.packaging || 0);

  const withMargin = base + (base * Number(product.margin || 0)) / 100;
  const withBuffer = withMargin + Number(product.buffer || 0);

  const applyOffer = (price) => {
  const afterOffer =
    price - (price * Number(product.offerPercentage || 0)) / 100;

    return afterOffer - Number(product.extraDiscount || 0);
  };

  // 🟢 ONLINE (full shipping)
  const online = applyOffer(withBuffer);

  // 🟡 OFFLINE (no shipping)
  const offline = applyOffer(
    withBuffer - Number(product.shipping || 0)
  );

  // 🔵 LOCAL (reduced shipping)
  const local = applyOffer(
    withBuffer - Number(product.shipping || 0) * 0.7
  );

  return {
    online: Math.round(online),
    offline: Math.round(offline),
    local: Math.round(local)
  };
};

const calculateProfit = (prices, product, finalPrice) => {
  const unitCost =
    Number(product.purchasePrice || 0) +
    Number(product.packaging || 0);

  const shippingCost = Number(product.shipping || 0);

  return {
    online: Math.round(finalPrice - (unitCost + shippingCost)),
    offline: Math.round(prices.offline - unitCost),
    local: Math.round(prices.local - (unitCost + shippingCost * 0.7))
  };
};

const calculatePackPrices = (price) => {
  return {
    single: price,
    pack2: price * 2 - 50,
    pack3: price * 3 - 120,
    pack5: price * 5 - 300
  };
};
  
const calculateSinglePackProfit = (packPrices) => {
  const unitCost =
    Number(product.purchasePrice || 0) +
    Number(product.packaging || 0);

  const shippingCost = Number(product.shipping || 0);

  return {
    single: packPrices.single - (unitCost * 1 + shippingCost),
    pack2: packPrices.pack2 - (unitCost * 2 + shippingCost),
    pack3: packPrices.pack3 - (unitCost * 3 + shippingCost),
    pack5: packPrices.pack5 - (unitCost * 5 + shippingCost)
  };
};

  const calculatePackProfit = (packPricing) => {
  return {
    online: calculateSinglePackProfit(packPricing.online),
    offline: calculateSinglePackProfit(packPricing.offline),
    local: calculateSinglePackProfit(packPricing.local)
  };
};

const prices = calculatePrices(product);
const finalPrice = product.customPrice || prices.online;
const profits = calculateProfit(prices, product, finalPrice);

const packPricing = {
  online: calculatePackPrices(prices.online),
  offline: calculatePackPrices(prices.offline),
  local: calculatePackPrices(prices.local)
};

const packProfit = calculatePackProfit(packPricing); 



  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input  style={{ margin: "5px" }} name="name" placeholder="Product Name" value={product.name} onChange={handleChange} />
      <select style={{ margin: "5px" }} name="category" value={product.category} onChange={handleChange}>
        <option value="">Select Category</option>
        <option value="Jabla">Jabla</option>
        <option value="Frock">Frock</option>
        <option value="Set">Set</option>
      </select>
      <input style={{ margin: "5px" }} name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} />
      <input style={{ margin: "5px" }} name="purchasePrice" placeholder="Purchase Price" value={product.purchasePrice} onChange={handleChange} />
      <input style={{ margin: "5px" }} name="shipping" placeholder="shippingCost" value={product.shipping} onChange={handleChange} />
      <input style={{ margin: "5px" }} name="packaging" placeholder="packagingCost" value={product.packaging} onChange={handleChange} />
      <input style={{ margin: "5px" }} name="margin" placeholder="margin %" value={product.margin} onChange={handleChange} />
      <input style={{ margin: "5px" }} name="buffer" placeholder="buffer" value={product.buffer} onChange={handleChange} />
      <input style={{ margin: "5px" }} name="offerPercentage" placeholder="offer %" value={product.offerPercentage} onChange={handleChange} />
      <input style={{ margin: "5px" }} name="extraDiscount" placeholder="extraDiscount" value={product.extraDiscount} onChange={handleChange} />
      
      <p>Online: ₹{prices.online}</p>
      <p>Offline: ₹{prices.offline}</p>
      <p>Local: ₹{prices.local}</p>
      <input style={{ margin: "5px" }} name="customPrice" placeholder="Override Online Price (Optional)"  value={product.customPrice} onChange={handleChange} />
      <p><b>Final Online Price: ₹{finalPrice}</b></p>
      <p>Online Profit: ₹{profits.online}</p>
      <p>Offline Profit: ₹{profits.offline}</p>
      <p>Local Profit: ₹{profits.local}</p>
      <h4>Pack Pricing</h4>
      <p>Single: ₹{packPricing.online.single} | Profit ₹{packProfit.online.single}</p>
      <p>Pack 2: ₹{packPricing.online.pack2} | Profit ₹{packProfit.online.pack2}</p>
      <p>Pack 3: ₹{packPricing.online.pack3} | Profit ₹{packProfit.online.pack3}</p>
      <p>Pack 5: ₹{packPricing.online.pack5} | Profit ₹{packProfit.online.pack5}</p>


      <button type="submit">
        {editingProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
    
  );
};

export default ProductForm;