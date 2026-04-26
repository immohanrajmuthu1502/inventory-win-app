export const getBestPriceWithBreakdown = (qty, pricing) => {
  if (!pricing) return { total: 0, breakdown: "" };

  const single = Number(pricing?.single || 0);
  const packs = pricing?.packs || {}; // 🔥 key fix

  if (Object.keys(packs).length === 0) {
    return {
      total: qty * single,
      breakdown: `${qty} × Single`,
    };
  }

  if (single <= 0) {
  return { total: 0, breakdown: "" };
}

  let remaining = qty;
  let total = 0;
  let breakdown = [];

  const packSizes = Object.keys(packs)
    .map(Number)
    .sort((a, b) => b - a);

  for (let size of packSizes) {
    while (remaining >= size && packs[size] > 0) {
      total += packs[size];
      breakdown.push(`Pack ${size}`);
      remaining -= size;
    }
  }

  if (remaining > 0) {
    total += remaining * single;
    breakdown.push(`${remaining} × Single`);
  }

  return {
    total,
    breakdown: breakdown.join(" + "),
  };
};

