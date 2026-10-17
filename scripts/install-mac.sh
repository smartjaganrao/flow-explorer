#!/bin/bash
set -e

echo "=========================================="
echo "📦 Installing FlowExplorer Pro to macOS..."
echo "=========================================="

# 1. Build production assets
echo "🔹 Step 1/6: Building production assets with electron-vite..."
npm run build

# 2. Package arm64 app directory with electron-builder
echo "🔹 Step 2/6: Packaging app directory..."
npx electron-builder --mac --arm64 --dir -c.mac.identity=null

APP_SRC="dist/mac-arm64/FlowExplorer Pro.app"
APP_DEST="/Applications/FlowExplorer Pro.app"

# 3. Kill any running instance and remove old bundle
echo "🔹 Step 3/6: Cleaning old installation..."
pkill -f "FlowExplorer Pro" 2>/dev/null || true
rm -rf "$APP_DEST"

# 4. Copy to /Applications
echo "🔹 Step 4/6: Copying to /Applications..."
cp -a "$APP_SRC" "$APP_DEST"

# 5. Clean metadata and attributes
echo "🔹 Step 5/6: Cleaning extended attributes..."
xattr -cr "$APP_DEST"
dot_clean "$APP_DEST" 2>/dev/null || true

# 6. Apply inside-out ad-hoc signatures with security entitlements
echo "🔹 Step 6/6: Signing frameworks, helpers, and bundle..."
ENT="$(pwd)/build/entitlements.mac.plist"
ENT_INH="$(pwd)/build/entitlements.mac.inherit.plist"

find "$APP_DEST/Contents/Frameworks" -name "*.dylib" -exec codesign --force --sign - {} + 2>/dev/null || true

for fw in "$APP_DEST/Contents/Frameworks/"*.framework; do
  codesign --force --sign - "$fw/Versions/A" 2>/dev/null || true
  codesign --force --sign - "$fw" 2>/dev/null || true
done

for helper in "$APP_DEST/Contents/Frameworks/"*.app; do
  codesign --force --sign - --entitlements "$ENT_INH" "$helper"
done

codesign --force --sign - --entitlements "$ENT" "$APP_DEST/Contents/MacOS/FlowExplorer Pro"
codesign --force --sign - --entitlements "$ENT" "$APP_DEST"

# Verify signature
codesign --verify --deep --strict "$APP_DEST"
xattr -dr com.apple.quarantine "$APP_DEST" 2>/dev/null || true

echo "=========================================="
echo "✅ FlowExplorer Pro installed successfully to /Applications!"
echo "=========================================="
