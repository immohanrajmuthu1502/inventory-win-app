export const DEFAULT_APP_SETTINGS = {
  shopName: "",
  shopAddress: "",
  shopEmail: "",
  shopPhone: "",
  billLogo: "",
  exportPath: "",
  dataStoragePath: "", // Empty = use default app data folder
  categories: ["No Category"],
  hasCompletedSetup: false, // Flag for first-launch detection
};

export const normalizeAppSettings = (settings = {}) => ({
  ...DEFAULT_APP_SETTINGS,
  ...settings,
});
