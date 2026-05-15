# GitHub Actions Setup - Quick Start

## What I've Set Up

✅ **GitHub Actions Workflow** (`.github/workflows/build-release.yml`)
- Automatically builds your app when you create a GitHub release
- Packages it into Windows EXE (installer + portable)
- Uploads files to the release page

✅ **Updated Build Configuration** 
- Added portable EXE target for lightweight downloads
- Configured GitHub publisher (for future auto-updates)
- Added desktop shortcuts in installer

✅ **Documentation**
- `RELEASE.md` - Complete release guide
- Version bumped to 1.0.0 for first public release

✅ **Electron-updater**
- Added dependency for future auto-update feature

---

## What You Need to Do - 3 Steps

### Step 1: Update GitHub Username in package.json

Find this line in `package.json`:
```json
"owner": "YOUR_GITHUB_USERNAME",
```

Replace with your actual GitHub username. Example:
```json
"owner": "immohammadsaqib",
```

### Step 2: Commit and Push to GitHub

```powershell
cd c:\Users\immoh\MohanrajMuthu\GitHub\inventory-win-app

# Add all changes
git add .

# Commit
git commit -m "Setup GitHub Actions CI/CD and release automation"

# Push to main branch
git push origin main
```

### Step 3: Create Your First Release

1. Go to: https://github.com/YOUR_USERNAME/inventory-win-app
2. Click **Releases** (right sidebar)
3. Click **Create a new release**
4. Fill in:
   - **Tag version**: `v1.0.0`
   - **Release title**: `Kutty Couture v1.0.0 - Initial Release`
   - **Description**: 
     ```
     Initial release of Kutty Couture Inventory Management System
     
     ## Features
     - Dashboard and analytics
     - Product management with barcodes
     - Billing and invoicing
     - Custom data storage location
     - Backup and restore
     - Multiple pricing tiers
     
     ## Installation
     Download `Kutty-Couture-1.0.0.exe` below and run the installer.
     ```
   - Check **Set as latest release**
   - Click **Publish release**

5. Watch the **Actions** tab (5-10 minutes) for the build to complete
6. When done, return to the release page and download the EXE!

---

## File Outputs

After build completes, you'll get:

```
Kutty-Couture-1.0.0.exe           # NSIS Installer (recommended for most users)
Kutty-Couture-1.0.0.exe.blockmap  # Update metadata
Kutty-Couture-Setup-1.0.0.exe     # Alternative installer name
```

Users can download either installer - both work great!

---

## Share Your App

Once you have the release, share these links:

**Direct Download:**
```
https://github.com/YOUR_USERNAME/inventory-win-app/releases/latest/download/Kutty-Couture-1.0.0.exe
```

**Release Page:**
```
https://github.com/YOUR_USERNAME/inventory-win-app/releases
```

---

## Next Release (v1.0.1)

When you fix bugs or add features:

1. Update version in `package.json`: `"version": "1.0.1"`
2. Commit and push
3. Create new release with tag `v1.0.1`
4. GitHub Actions builds automatically

That's it! No manual builds needed.

---

## Troubleshooting

### "Build failed" in Actions
- Check the workflow logs (click on the failed build)
- Common issues: Missing dependencies, Node version mismatch
- Try locally: `npm ci && npm run build && npm run dist:win`

### EXE not appearing in release
- Wait 10+ minutes for build to complete
- Check Actions tab for errors
- Verify the workflow file exists: `.github/workflows/build-release.yml`

### Can't find Actions tab
- Go to your repo main page
- Click "Actions" at the top

---

## Questions?
Refer to `RELEASE.md` for detailed documentation.
Happy releasing! 🚀
