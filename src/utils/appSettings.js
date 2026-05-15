export const DEFAULT_APP_SETTINGS = {
  shopName: "Kutty Couture",
  shopAddress: "Chennai",
  shopEmail: "",
  shopPhone: "9XXXXXXXXX",
  billLogo: "",
  exportPath: "",
  dataStoragePath: "", // Empty = use default app data folder
  categories: ["No Category", "Jabla", "Frock", "Set"],
};

export const normalizeAppSettings = (settings = {}) => ({
  ...DEFAULT_APP_SETTINGS,
  ...settings,
});
