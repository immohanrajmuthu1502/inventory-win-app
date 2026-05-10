export const DEFAULT_APP_SETTINGS = {
  shopName: "Kutty Couture",
  shopAddress: "Chennai",
  shopEmail: "",
  shopPhone: "9XXXXXXXXX",
  billLogo: "",
  exportPath: "",
  categories: ["No Category", "Jabla", "Frock", "Set"],
};

export const normalizeAppSettings = (settings = {}) => ({
  ...DEFAULT_APP_SETTINGS,
  ...settings,
});
