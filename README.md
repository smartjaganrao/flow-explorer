# FlowExplorer Pro 🌊

> The Next-Generation Desktop File Manager uniting **macOS Liquid Glassmorphism** with **Windows 11 Keyboard Ergonomics**.

---

## ✨ Features

- 🪟 **Liquid Glassmorphism UI**: Native macOS vibrancy with curated high-contrast Dark & Light modes.
- ⌨️ **Windows Explorer Ergonomics**:
  - `Enter` to open folder / launch file (no accidental renaming).
  - `F2` for instant inline renaming.
  - `Ctrl+C` (Copy), `Ctrl+X` (Cut), `Ctrl+V` (Paste / Move with conflict handling).
  - `Ctrl+Z` Undo file operations.
  - `Delete` (Safe Trash) & `Shift+Delete` (Permanent surgical shred).
  - `Ctrl+A` Select all items.
  - `F5` / `Ctrl+R` Instant refresh.
- 🗂️ **Action Ribbon**: Modern Windows 11-style command bar for quick actions.
- 🌓 **Dual Split-Pane View**: Side-by-side directory navigation (`⌘\` / `Ctrl+\`).
- ⚡ **Integrated Quake Terminal**: Built-in drop-down CLI drawer (`Ctrl+\``).
- 🧹 **Deep App Uninstaller**: Scans and cleans orphaned caches, application support files, and preference plists.
- 🚀 **System Performance Enhancer**: Real-time memory pressure monitoring, DNS flush, and active process management.
- 🔍 **Live Inspector**: Instant file metadata, MIME inspection, and cryptographic checksums (SHA-256 / MD5).

---

## 🛠️ Tech Stack

- **Runtime:** [Electron 33+](https://www.electronjs.org/)
- **Frontend:** [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Custom Glass tokens
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build System:** `electron-vite` + `electron-builder`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/flow-explorer.git
cd flow-explorer

# Install dependencies
npm install
```

### Development

```bash
# Start the Electron development server with Hot Module Replacement
npm run dev
```

### Production Build

```bash
# Compile and package for macOS (.dmg / .zip)
npm run build:mac
```

---

## 📄 License

MIT License © 2026 FlowExplorer Team
