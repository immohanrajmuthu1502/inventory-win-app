# GitHub Release and Distribution Guide

## Overview
Your app is now set up with GitHub Actions CI/CD. Every time you create a release on GitHub, it will automatically:
1. Check out your code
2. Install dependencies
3. Build the React app
4. Package it with Electron
5. Upload the Windows EXE files to the release

## How to Create a Release

### Step 1: Update Version in package.json
Before creating a release, update the version in `package.json`:
```json
{
  "version": "1.0.1"  // Increment from 1.0.0
}
```

Follow semantic versioning:
- `1.0.0` → `1.0.1` (bug fix)
- `1.0.0` → `1.1.0` (new features)
- `1.0.0` → `2.0.0` (breaking changes)

### Step 2: Commit and Push
```powershell
git add package.json
git commit -m "Bump version to 1.0.1"
git push origin main
```

### Step 3: Create a GitHub Release
1. Go to your GitHub repo: https://github.com/[your-username]/inventory-win-app
2. Click **"Releases"** on the right sidebar
3. Click **"Create a new release"**
4. Fill in:
   - **Tag version**: `v1.0.1` (must start with 'v')
   - **Release title**: `Kutty Couture v1.0.1`
   - **Description**: Write release notes like:
     ```
     ## What's New
     - Fixed data migration issue
     - Improved performance
     
     ## Bug Fixes
     - Storage path not updating after restart (Fixed)
     
     ## Installation
     Download `Kutty-Couture-1.0.1.exe` below and run it.
     ```
   - Click **"Set as latest release"** (recommended)
   - Click **"Publish release"**

### Step 4: Wait for Build (GitHub Actions)
- The workflow will start automatically
- Check the **Actions** tab to see build progress
- Takes ~5-10 minutes to complete
- When done, you'll see the EXE files attached to the release

---

## Release Channels

You can create different types of releases:

### **Stable Release** (Current setup)
```
Tag: v1.0.0
Latest: ✓ Yes
Pre-release: ✗ No
```
Users see this as the main version to download.

### **Pre-release / Beta**
```
Tag: v1.1.0-beta.1
Latest: ✗ No
Pre-release: ✓ Yes
```
For testing with early adopters before stable release.

---

## Distribution Methods

### **Method 1: GitHub Releases (Recommended for Now)**
- Users visit: https://github.com/[your-username]/inventory-win-app/releases
- Download the `.exe` file
- Run installer

### **Method 2: GitHub Pages Website (Optional)**
Create a landing page at `https://[your-username].github.io/inventory-win-app/`
```html
<a href="https://github.com/[username]/inventory-win-app/releases/latest/download/Kutty-Couture-1.0.0.exe">
  Download Kutty Couture
</a>
```

### **Method 3: Direct Link (User-Friendly)**
Share this link: 
```
https://github.com/[your-username]/inventory-win-app/releases/latest/download/Kutty-Couture-1.0.0.exe
```
Automatically points to the latest release!

---

## First Release Checklist

- [ ] Update version in `package.json`
- [ ] Test the app thoroughly (especially the build)
- [ ] Commit and push changes
- [ ] Go to GitHub → Releases
- [ ] Create a new release with tag `v1.0.0`
- [ ] Write clear release notes
- [ ] Publish release
- [ ] Wait for GitHub Actions to complete
- [ ] Verify EXE files are attached
- [ ] Download and test the EXE locally
- [ ] Share the download link with users!

---

## Future: Auto-Updates (Optional)

To add auto-update functionality (users get notified of new versions):

1. Install electron-updater:
```powershell
npm install electron-updater
```

2. Add to `electron.js`:
```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

3. Configure in `package.json`:
```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "[your-username]",
    "repo": "inventory-win-app"
  }
}
```

Then users get automatic update notifications! (Setup guide in separate doc if needed)

---

## Troubleshooting

### Release not building?
1. Check **Actions** tab for error logs
2. Common issues:
   - Missing dependencies: Run `npm ci` locally first
   - Node version mismatch: Workflow uses Node 20
   - Electron rebuild issues: Check Windows security software blocking

### EXE not downloading?
1. Go to release page
2. Scroll down to find attached files
3. Look for `Kutty-Couture-*.exe` files
4. If missing, check Actions tab for build errors

### Want to skip release build?
Use the workflow_dispatch trigger (comes in v2 of workflow)

---

## Next Steps

1. **Create first release** with v1.0.0
2. **Share with early users** for testing
3. **Gather feedback** and create v1.0.1 with fixes
4. **Consider Microsoft Store** when app is stable
5. **Add auto-updates** when ready
