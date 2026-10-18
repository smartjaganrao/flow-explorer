import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  Folder, File, FileCode, FileImage, FileText, FileArchive, FileAudio,
  FileVideo, Terminal, Code2, Plus, Scissors, Copy, ClipboardPaste,
  Trash2, RefreshCw, ChevronRight, ChevronLeft, ArrowUp, Search,
  Eye, LayoutGrid, List, Columns, Sun, Moon, Sparkles, Check,
  AlertCircle, X, ExternalLink, CornerDownLeft, FolderPlus,
  FilePlus, Edit3, HardDrive, Home, Download, FileSpreadsheet,
  Layers, ArrowRight, Star, Tag, GitBranch, Hash, Play, Pause,
  Volume2, SlidersHorizontal, ArrowUpDown, ShieldCheck,
  Maximize2, Minimize2, TerminalSquare, Info, Share2, Music, Video,
  ChevronDown, CheckSquare, Clock, FolderTree, Cpu, CheckCircle2,
  Filter, Boxes, AlertTriangle, Zap, Activity, Rocket, Gauge,
  AppWindow, PackageX, HelpCircle, RotateCcw,
  ZoomIn, ZoomOut, RotateCw, Images, Settings,
  Monitor, Laptop, Cloud, Disc, Eject, Radio, Film, Image, Triangle, Tags, ArrowDown
} from 'lucide-react'
import flowLogo from './assets/logo.png'

// --- In-Memory Mock API for Standalone Browser Preview & Fallback ---
const createMockAPI = () => {
  const homePath = '/Users/alex'
  const mockStorage = {
    [homePath]: [
      { name: 'Desktop', path: `${homePath}/Desktop`, isDirectory: true, isFile: false, size: 0, mtime: Date.now() - 3600000, birthtime: Date.now() - 86400000, permissions: '0755', extension: '', isHidden: false },
      { name: 'Documents', path: `${homePath}/Documents`, isDirectory: true, isFile: false, size: 0, mtime: Date.now() - 7200000, birthtime: Date.now() - 86400000, permissions: '0755', extension: '', isHidden: false },
      { name: 'Downloads', path: `${homePath}/Downloads`, isDirectory: true, isFile: false, size: 0, mtime: Date.now() - 1000000, birthtime: Date.now() - 86400000, permissions: '0755', extension: '', isHidden: false },
      { name: 'Projects', path: `${homePath}/Projects`, isDirectory: true, isFile: false, size: 0, mtime: Date.now() - 500000, birthtime: Date.now() - 86400000, permissions: '0755', extension: '', isHidden: false },
      { name: '.DS_Store', path: `${homePath}/.DS_Store`, isDirectory: false, isFile: true, size: 14336, mtime: Date.now() - 20000, birthtime: Date.now() - 100000, permissions: '0644', extension: '', isHidden: true },
      { name: 'debug.log', path: `${homePath}/debug.log`, isDirectory: false, isFile: true, size: 5242880, mtime: Date.now() - 30000, birthtime: Date.now() - 100000, permissions: '0644', extension: '.log', isHidden: false },
      { name: 'Architecture.pdf', path: `${homePath}/Architecture.pdf`, isDirectory: false, isFile: true, size: 2840000, mtime: Date.now() - 1500000, birthtime: Date.now() - 86400000, permissions: '0644', extension: '.pdf', isHidden: false }
    ],
    [`${homePath}/Projects`]: [
      { name: 'flow-explorer', path: `${homePath}/Projects/flow-explorer`, isDirectory: true, isFile: false, size: 0, mtime: Date.now() - 10000, birthtime: Date.now() - 900000, permissions: '0755', extension: '', isHidden: false },
      { name: 'package.json', path: `${homePath}/Projects/package.json`, isDirectory: false, isFile: true, size: 840, mtime: Date.now() - 60000, birthtime: Date.now() - 900000, permissions: '0644', extension: '.json', isHidden: false },
      { name: 'hero-banner.png', path: `${homePath}/Projects/hero-banner.png`, isDirectory: false, isFile: true, size: 245000, mtime: Date.now() - 120000, birthtime: Date.now() - 500000, permissions: '0644', extension: '.png', isHidden: false },
      { name: 'release.zip', path: `${homePath}/Projects/release.zip`, isDirectory: false, isFile: true, size: 4500000, mtime: Date.now() - 400000, birthtime: Date.now() - 500000, permissions: '0644', extension: '.zip', isHidden: false },
      { name: 'podcast-intro.mp3', path: `${homePath}/Projects/podcast-intro.mp3`, isDirectory: false, isFile: true, size: 1840000, mtime: Date.now() - 300000, birthtime: Date.now() - 400000, permissions: '0644', extension: '.mp3', isHidden: false }
    ]
  }

  return {
    getHome: async () => homePath,
    getVolumes: async () => ({
      success: true,
      favorites: [
        { name: 'Desktop', path: `${homePath}/Desktop`, type: 'desktop', hasCloud: true },
        { name: 'Documents', path: `${homePath}/Documents`, type: 'documents', hasCloud: true },
        { name: 'Downloads', path: `${homePath}/Downloads`, type: 'downloads' },
        { name: 'Movies', path: `${homePath}/Movies`, type: 'movies' },
        { name: 'Music', path: `${homePath}/Music`, type: 'music' },
        { name: 'Pictures', path: `${homePath}/Pictures`, type: 'pictures' },
        { name: 'AI Tutor', path: `${homePath}/Projects`, type: 'custom' }
      ],
      cloudLocations: [
        { name: 'iCloud Drive', path: `${homePath}/Library/Mobile Documents/com~apple~CloudDocs`, type: 'icloud', hasSync: true },
        { name: 'O+Connect', path: `${homePath}/Library/CloudStorage/O+Connect-DeviceSpace`, type: 'cloudfolder' },
        { name: 'Google Drive', path: `${homePath}/Library/CloudStorage/GoogleDrive-smartjaganrao@gmail.com`, type: 'googledrive' }
      ],
      deviceLocations: [
        { name: 'jaganrao', path: homePath, type: 'home' },
        { name: 'Jagan’s MacBook Air', path: 'my-computer', type: 'computer' },
        { name: 'Jagan', path: '/', type: 'root' }
      ],
      removableVolumes: [
        { name: 'Rise of the Tomb Raider 1.0.4', path: '/Volumes/Rise of the Tomb Raider 1.0.4', type: 'volume', isRemovable: true },
        { name: 'Road Redemption', path: '/Volumes/Road Redemption', type: 'volume', isRemovable: true },
        { name: 'Concat', path: '/Volumes/Concat', type: 'volume', isRemovable: true }
      ],
      airdrop: { name: 'AirDrop', path: 'airdrop', type: 'airdrop' },
      trash: { name: 'Bin', path: `${homePath}/.Trash`, type: 'trash' },
      computerName: 'Jagan’s MacBook Air',
      primaryDiskName: 'Jagan',
      flat: [
        { name: 'Home', path: homePath, type: 'home' },
        { name: 'Desktop', path: `${homePath}/Desktop`, type: 'desktop' },
        { name: 'Documents', path: `${homePath}/Documents`, type: 'documents' },
        { name: 'Downloads', path: `${homePath}/Downloads`, type: 'downloads' },
        { name: 'Pictures', path: `${homePath}/Pictures`, type: 'pictures' },
        { name: 'Music', path: `${homePath}/Music`, type: 'music' },
        { name: 'Movies', path: `${homePath}/Movies`, type: 'movies' },
        { name: 'Macintosh HD', path: '/', type: 'root' }
      ]
    }),
    ejectVolume: async () => ({ success: true }),
    getDiskSpace: async () => ({ success: true, freeBytes: 135 * 1024 * 1024 * 1024, totalBytes: 500 * 1024 * 1024 * 1024, usedPercent: 73 }),
    getDiskBreakdown: async () => ({
      success: true,
      totalBytes: 500 * 1024 * 1024 * 1024,
      freeBytes: 135 * 1024 * 1024 * 1024,
      usedBytes: 365 * 1024 * 1024 * 1024,
      usedPercent: 73,
      categories: {
        junk: { label: 'Junk Files', bytes: 111 * 1024 * 1024 * 1024, color: '#5E72EB' },
        duplicates: { label: 'Duplicate Files', bytes: 3.49 * 1024 * 1024 * 1024, color: '#A855F7' },
        apps: { label: 'Applications', bytes: 14.8 * 1024 * 1024 * 1024, color: '#F97316' },
        largeOld: { label: 'Large & Old Files', bytes: 3.83 * 1024 * 1024 * 1024, color: '#FACC15' }
      }
    }),
    scanDuplicates: async () => ({
      success: true,
      totalDuplicatesCount: 2,
      totalReclaimableBytes: 3.49 * 1024 * 1024 * 1024,
      groups: [
        {
          id: 'dup1',
          name: 'Hero_Mockup_Final.png',
          size: 1.2 * 1024 * 1024 * 1024,
          files: [
            { path: `${homePath}/Downloads/Hero_Mockup_Final.png`, name: 'Hero_Mockup_Final.png', size: 1.2 * 1024 * 1024 * 1024, mtime: Date.now() - 3600000 },
            { path: `${homePath}/Desktop/Hero_Mockup_Final (1).png`, name: 'Hero_Mockup_Final (1).png', size: 1.2 * 1024 * 1024 * 1024, mtime: Date.now() - 86400000 }
          ]
        },
        {
          id: 'dup2',
          name: 'Xcode_Component_Backup.zip',
          size: 2.29 * 1024 * 1024 * 1024,
          files: [
            { path: `${homePath}/Downloads/Xcode_Component_Backup.zip`, name: 'Xcode_Component_Backup.zip', size: 2.29 * 1024 * 1024 * 1024, mtime: Date.now() - 7200000 },
            { path: `${homePath}/Documents/Archive/Xcode_Component_Backup_copy.zip`, name: 'Xcode_Component_Backup_copy.zip', size: 2.29 * 1024 * 1024 * 1024, mtime: Date.now() - 172800000 }
          ]
        }
      ]
    }),
    cleanDuplicates: async (paths) => ({ success: true, count: paths.length, reclaimedBytes: 3.49 * 1024 * 1024 * 1024, errors: [] }),
    scanLargeOldFiles: async () => ({
      success: true,
      totalBytes: 3.83 * 1024 * 1024 * 1024,
      files: [
        { path: `${homePath}/Downloads/Rise.of.the.Tomb.Raider.dmg`, name: 'Rise.of.the.Tomb.Raider.dmg', size: 2.1 * 1024 * 1024 * 1024, mtime: Date.now() - 120 * 86400000, isOld: true, extension: '.dmg' },
        { path: `${homePath}/Downloads/4K_Drone_Footage_RAW.mov`, name: '4K_Drone_Footage_RAW.mov', size: 1.2 * 1024 * 1024 * 1024, mtime: Date.now() - 150 * 86400000, isOld: true, extension: '.mov' },
        { path: `${homePath}/Documents/VirtualMachine_Ubuntu.iso`, name: 'VirtualMachine_Ubuntu.iso', size: 530 * 1024 * 1024, mtime: Date.now() - 200 * 86400000, isOld: true, extension: '.iso' }
      ]
    }),
    getGitStatus: async () => ({ isGit: true, branch: 'main', modifiedCount: 2, untrackedCount: 1 }),
    calcHash: async () => ({ success: true, sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', md5: '5d41402abc4b2a76b9719d911017c592' }),
    batchRename: async () => ({ success: true }),
    runCommand: async (cmd) => ({ success: true, stdout: `Executed: ${cmd}\nstatus: active`, stderr: '', exitCode: 0 }),
    scanCleaner: async () => ({
      success: true,
      totalReclaimable: 1485000000,
      items: [
        { name: '.DS_Store', path: `${homePath}/.DS_Store`, category: 'macOS Junk', description: 'System metadata cache', size: 14336 },
        { name: 'debug.log', path: `${homePath}/debug.log`, category: 'Logs & Temp Files', description: 'Temporary debug log', size: 5242880 },
        { name: 'node_modules', path: `${homePath}/Projects/node_modules`, category: 'Dev Caches & Build Artifacts', description: 'Cached dependencies', size: 1450000000 },
        { name: 'sample.tmp', path: `${homePath}/sample.tmp`, category: 'Logs & Temp Files', description: 'Temporary cache file', size: 240000 }
      ]
    }),
    cleanJunk: async (paths) => ({ success: true, count: paths.length, reclaimedBytes: 1485000000, errors: [] }),
    previewReorganize: async (targetPath, strategy) => {
      if (strategy === 'ai') {
        return {
          success: true,
          moves: [
            { filename: 'Invoice_Q3_2026.pdf', src: `${targetPath}/Invoice_Q3_2026.pdf`, destDir: `${targetPath}/Financial Invoices & Receipts`, destPath: `${targetPath}/Financial Invoices & Receipts/Invoice_Q3_2026.pdf`, category: 'Financial Invoices & Receipts', reason: 'Identified as billing, tax, or payment record' },
            { filename: 'Staff_Engineer_Resume.docx', src: `${targetPath}/Staff_Engineer_Resume.docx`, destDir: `${targetPath}/Career & Job Applications`, destPath: `${targetPath}/Career & Job Applications/Staff_Engineer_Resume.docx`, category: 'Career & Job Applications', reason: 'Resume, portfolio, or career application document' },
            { filename: 'Design_System_Tokens.fig', src: `${targetPath}/Design_System_Tokens.fig`, destDir: `${targetPath}/Design & UI Assets`, destPath: `${targetPath}/Design & UI Assets/Design_System_Tokens.fig`, category: 'Design & UI Assets', reason: 'Design mockup, icon, vector graphic, or logo' },
            { filename: 'flight_ticket_emirates.pdf', src: `${targetPath}/flight_ticket_emirates.pdf`, destDir: `${targetPath}/Travel & Bookings`, destPath: `${targetPath}/Travel & Bookings/flight_ticket_emirates.pdf`, category: 'Travel & Bookings', reason: 'Travel ticket, boarding pass, or booking confirmation' }
          ],
          categoryCounts: {
            'Financial Invoices & Receipts': 1,
            'Career & Job Applications': 1,
            'Design & UI Assets': 1,
            'Travel & Bookings': 1
          }
        }
      }
      return {
        success: true,
        moves: [
          { filename: 'Architecture.pdf', src: `${targetPath}/Architecture.pdf`, destDir: `${targetPath}/Documents`, destPath: `${targetPath}/Documents/Architecture.pdf`, category: 'Documents', reason: `Organized by ${strategy}` },
          { filename: 'debug.log', src: `${targetPath}/debug.log`, destDir: `${targetPath}/Documents`, destPath: `${targetPath}/Documents/debug.log`, category: 'Documents', reason: `Organized by ${strategy}` }
        ],
        categoryCounts: { Documents: 2 }
      }
    },
    executeReorganize: async (moves) => ({ success: true, movedCount: moves.length, errors: [] }),
    listApps: async () => ({
      success: true,
      apps: [
        { name: 'Slack', filename: 'Slack.app', path: '/Applications/Slack.app', bundleId: 'com.tinyspeck.slackmacgap', version: '4.38.125', isSystem: false },
        { name: 'Google Chrome', filename: 'Google Chrome.app', path: '/Applications/Google Chrome.app', bundleId: 'com.google.Chrome', version: '130.0.6723', isSystem: false },
        { name: 'Figma', filename: 'Figma.app', path: '/Applications/Figma.app', bundleId: 'com.figma.Desktop', version: '124.3.2', isSystem: false },
        { name: 'Visual Studio Code', filename: 'Visual Studio Code.app', path: '/Applications/Visual Studio Code.app', bundleId: 'com.microsoft.VSCode', version: '1.94.2', isSystem: false },
        { name: 'Spotify', filename: 'Spotify.app', path: '/Applications/Spotify.app', bundleId: 'com.spotify.client', version: '1.2.48', isSystem: false },
        { name: 'Docker Desktop', filename: 'Docker.app', path: '/Applications/Docker.app', bundleId: 'com.docker.docker', version: '4.35.0', isSystem: false },
        { name: 'Notion', filename: 'Notion.app', path: '/Applications/Notion.app', bundleId: 'notion.id', version: '3.12.0', isSystem: false }
      ]
    }),
    scanAppLeftovers: async ({ name, path: appPath, bundleId }) => ({
      success: true,
      appBundle: { name, path: appPath, size: 340000000 },
      leftovers: [
        { name: name, path: `/Users/alex/Library/Application Support/${name}`, category: 'Application Support', size: 520000000 },
        { name: bundleId, path: `/Users/alex/Library/Caches/${bundleId}`, category: 'Caches', size: 840000000 },
        { name: `${bundleId}.plist`, path: `/Users/alex/Library/Preferences/${bundleId}.plist`, category: 'Preferences', size: 12400 },
        { name: `${bundleId}.savedState`, path: `/Users/alex/Library/Saved Application State/${bundleId}.savedState`, category: 'Saved State', size: 4500000 },
        { name: bundleId, path: `/Users/alex/Library/Logs/${bundleId}`, category: 'Logs', size: 28000000 }
      ],
      totalFootprint: 1732512400
    }),
    uninstallDeep: async (paths) => ({ success: true, removedCount: paths.length, reclaimedBytes: 1732512400, errors: [] }),
    scanOrphanLeftovers: async () => ({
      success: true,
      items: [
        { name: 'com.sketch.sketch3', path: '/Users/alex/Library/Caches/com.sketch.sketch3', category: 'Caches', size: 1420000000 },
        { name: 'Postman', path: '/Users/alex/Library/Application Support/Postman', category: 'Application Support', size: 980000000 },
        { name: 'com.sublimetext.3.savedState', path: '/Users/alex/Library/Saved Application State/com.sublimetext.3.savedState', category: 'Saved Application State', size: 45000000 }
      ],
      totalBytes: 2445000000
    }),
    getSystemPerfStats: async () => ({
      success: true,
      cpu: { cores: 10, model: 'Apple M3 Pro', usagePercent: 18 },
      memory: {
        totalBytes: 36 * 1024 * 1024 * 1024,
        freeBytes: 14 * 1024 * 1024 * 1024,
        usedBytes: 22 * 1024 * 1024 * 1024,
        usedPercent: 61,
        activeMB: 10240,
        inactiveMB: 6144,
        wiredMB: 4096,
        compressedMB: 2048
      },
      uptimeSeconds: 142800,
      platform: 'macOS',
      arch: 'arm64'
    }),
    listProcesses: async () => ({
      success: true,
      processes: [
        { pid: 4821, name: 'Google Chrome Helper', command: '/Applications/Google Chrome.app/...', cpuPercent: 12.4, memPercent: 4.8, memMB: 1720 },
        { pid: 1824, name: 'Code Helper', command: '/Applications/Visual Studio Code.app/...', cpuPercent: 8.2, memPercent: 3.2, memMB: 1140 },
        { pid: 312, name: 'WindowServer', command: '/System/Library/.../WindowServer', cpuPercent: 5.1, memPercent: 2.1, memMB: 750 },
        { pid: 5910, name: 'Slack Helper', command: '/Applications/Slack.app/...', cpuPercent: 3.4, memPercent: 1.8, memMB: 640 },
        { pid: 2190, name: 'Docker Desktop', command: '/Applications/Docker.app/...', cpuPercent: 2.1, memPercent: 5.4, memMB: 1940 },
        { pid: 902, name: 'kernel_task', command: 'kernel_task', cpuPercent: 1.9, memPercent: 1.2, memMB: 430 }
      ]
    }),
    killProcess: async (pid) => ({ success: true }),
    optimizeMemory: async () => ({ success: true, message: 'Purged inactive RAM pages and flushed filesystem write buffers.' }),
    flushDns: async () => ({ success: true, message: 'macOS DNS Cache flushed and mDNSResponder reset successfully.' }),
    cleanQuicklookCache: async () => ({ success: true, message: 'QuickLook thumbnail caches and generator daemon reset.' }),
    readDir: async (targetPath, options = { showHidden: false }) => {
      const p = targetPath.replace(/^~/, homePath)
      const list = mockStorage[p] || [
        { name: 'src', path: `${p}/src`, isDirectory: true, isFile: false, size: 0, mtime: Date.now(), birthtime: Date.now(), permissions: '0755', extension: '', isHidden: false },
        { name: 'README.md', path: `${p}/README.md`, isDirectory: false, isFile: true, size: 1200, mtime: Date.now(), birthtime: Date.now(), permissions: '0644', extension: '.md', isHidden: false }
      ]
      const items = list.filter((item) => options.showHidden || !item.isHidden)
      return { success: true, path: p, items }
    },
    getThumbnail: async (filePath) => {
      const ext = (filePath.split('.').pop() || '').toLowerCase()
      if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
        return {
          success: true,
          type: 'image',
          thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><defs><linearGradient id="p" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23818cf8"/><stop offset="100%" stop-color="%23c084fc"/></linearGradient></defs><rect width="300" height="200" rx="8" fill="url(%23p)"/><circle cx="150" cy="90" r="40" fill="white" fill-opacity="0.25"/><path d="M50 170 L110 110 L160 150 L220 80 L270 170 Z" fill="white" fill-opacity="0.4"/><text x="150" y="185" fill="white" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Image Preview</text></svg>'
        }
      }
      if (ext === 'pdf') {
        return {
          success: true,
          type: 'document',
          ext: 'pdf',
          thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="280" viewBox="0 0 220 280"><rect width="220" height="280" rx="10" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><rect x="0" y="0" width="220" height="50" rx="10" fill="%23ef4444"/><text x="110" y="32" fill="white" font-size="16" font-weight="bold" text-anchor="middle" font-family="sans-serif">PDF DOCUMENT</text><rect x="25" y="80" width="170" height="10" rx="5" fill="%2394a3b8"/><rect x="25" y="105" width="150" height="8" rx="4" fill="%23cbd5e1"/><rect x="25" y="125" width="165" height="8" rx="4" fill="%23cbd5e1"/><rect x="25" y="145" width="130" height="8" rx="4" fill="%23cbd5e1"/><rect x="25" y="180" width="170" height="65" rx="6" fill="%23f1f5f9" stroke="%23e2e8f0"/><text x="110" y="220" fill="%2364748b" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">FlowExplorer Architecture</text></svg>'
        }
      }
      if (['md', 'txt', 'json', 'js', 'ts', 'py'].includes(ext)) {
        return {
          success: true,
          type: 'text',
          ext,
          snippet: '# Architecture Document\nFlowExplorer Pro v3.0\nHigh-Performance Native Files'
        }
      }
      return { success: false }
    },
    readPreview: async (filePath) => {
      if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
        return {
          success: true,
          type: 'image',
          previewData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366f1"/><stop offset="100%" stop-color="%2338bdf8"/></linearGradient></defs><rect width="400" height="260" rx="12" fill="url(%23g)"/><text x="200" y="135" fill="white" font-size="20" font-weight="bold" text-anchor="middle" font-family="sans-serif">FlowExplorer Pro</text></svg>',
          stats: { size: 245000, mtime: Date.now(), birthtime: Date.now(), mode: '0644' }
        }
      }
      return {
        success: true,
        type: 'text',
        previewData: `// FlowExplorer Pro File Preview\n// Path: ${filePath}\n\nexport const explorerConfig = {\n  engine: "FlowV3",\n  aesthetic: "Linear/Raycast Obsidian",\n  keyboardErgonomics: "Windows 11 Explorer",\n  systemVibrancy: "macOS Sequoia",\n  hardwareAccelerated: true,\n  sha256Verification: true\n};\n\nconsole.log("Welcome to next-gen file exploration!");`,
        totalLines: 12,
        isTruncated: false,
        stats: { size: 1024, mtime: Date.now(), birthtime: Date.now(), mode: '0644' }
      }
    },
    mkdir: async (p, name) => ({ success: true, path: `${p}/${name}` }),
    mkfile: async (p, name) => ({ success: true, path: `${p}/${name}` }),
    rename: async () => ({ success: true }),
    copy: async () => ({ success: true }),
    move: async () => ({ success: true }),
    trash: async () => ({ success: true }),
    deletePermanent: async () => ({ success: true }),
    writeClipboard: async () => ({ success: true }),
    readClipboard: async () => ({ success: true, text: '' }),
    onShortcut: () => () => {},
    openPath: async () => ({ success: true }),
    openTerminal: async () => ({ success: true }),
    openVSCode: async () => ({ success: true }),
    getInitialPath: async () => null,
    onOpenExternalPath: () => () => {},
    setDefaultFileManager: async () => ({ success: true, protocolRegistered: true }),
    getLoginItemSettings: async () => ({ success: true, settings: { openAtLogin: false } }),
    setLoginItemSettings: async (s) => ({ success: true, settings: s }),
    toggleFullScreen: async () => false,
    isFullScreen: async () => false,
    toggleMaximize: async () => false
  }
}

const api = (typeof window !== 'undefined' && window.explorerAPI) ? window.explorerAPI : createMockAPI()

// Utility: Format bytes cleanly
function formatBytes(bytes) {
  if (bytes === 0 || !bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Utility: Format Date
function formatDate(timestamp) {
  if (!timestamp) return '-'
  const d = new Date(timestamp)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Color Tag Definitions
const COLOR_TAGS = [
  { name: 'red', hex: '#ef4444', label: 'Red' },
  { name: 'orange', hex: '#f97316', label: 'Orange' },
  { name: 'yellow', hex: '#eab308', label: 'Yellow' },
  { name: 'green', hex: '#22c55e', label: 'Green' },
  { name: 'blue', hex: '#3b82f6', label: 'Blue' },
  { name: 'purple', hex: '#a855f7', label: 'Purple' },
  { name: 'grey', hex: '#94a3b8', label: 'Grey' }
]

// Color-coded file icons
function FileIcon({ item, className = "w-4 h-4" }) {
  if (item.isDirectory) {
    return <Folder className={`${className} text-amber-400 fill-amber-400/20`} />
  }
  const ext = (item.extension || '').toLowerCase()
  if (['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.scss', '.py', '.rs', '.go', '.c', '.cpp', '.h', '.sh', '.bash', '.zsh', '.yml', '.yaml', '.toml', '.sql'].includes(ext)) {
    return <FileCode className={`${className} text-sky-400`} />
  }
  if (['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.bmp', '.ico', '.tiff', '.heic', '.raw', '.psd'].includes(ext)) {
    return <FileImage className={`${className} text-purple-400`} />
  }
  if (['.pdf', '.doc', '.docx', '.txt', '.md', '.markdown', '.rtf', '.pages'].includes(ext)) {
    return <FileText className={`${className} text-rose-400`} />
  }
  if (['.zip', '.tar', '.gz', '.bz2', '.7z', '.rar', '.dmg', '.pkg', '.iso'].includes(ext)) {
    return <FileArchive className={`${className} text-emerald-400`} />
  }
  if (['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.aiff'].includes(ext)) {
    return <FileAudio className={`${className} text-indigo-400`} />
  }
  if (['.mp4', '.mov', '.mkv', '.webm', '.avi', '.m4v'].includes(ext)) {
    return <FileVideo className={`${className} text-pink-400`} />
  }
  if (['.xls', '.xlsx', '.csv', '.tsv', '.numbers'].includes(ext)) {
    return <FileSpreadsheet className={`${className} text-emerald-500`} />
  }
  return <File className={`${className} text-slate-400`} />
}

// Universal Image file extension classifier
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.bmp', '.ico', '.tiff', '.heic', '.raw', '.avif', '.psd']
function isImageFile(item) {
  if (!item || item.isDirectory) return false
  const ext = (item.extension || '').toLowerCase() || (item.name && item.name.includes('.') ? '.' + item.name.split('.').pop().toLowerCase() : '')
  return IMAGE_EXTENSIONS.includes(ext)
}

// Client-side cache for high performance thumbnail rendering
const globalThumbCache = new Map()

function FileThumbnail({ item, mode = 'grid', className = '' }) {
  const [thumb, setThumb] = useState(() => globalThumbCache.get(item.path) || null)
  const ext = (item.extension || '').toLowerCase()
  const isImage = isImageFile(item)
  const isRichDoc = ['.pdf', '.doc', '.docx', '.pages', '.xls', '.xlsx', '.ppt', '.pptx', '.keynote', '.numbers', '.app'].includes(ext)
  const isTextDoc = ['.txt', '.md', '.markdown', '.rtf', '.json', '.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.sql', '.sh', '.csv', '.yaml', '.yml', '.env', '.log', '.xml'].includes(ext)
  const isDoc = isRichDoc || isTextDoc

  useEffect(() => {
    let isMounted = true
    if (item.isDirectory) return
    if (!isImage && !isDoc) return

    if (globalThumbCache.has(item.path)) {
      setThumb(globalThumbCache.get(item.path))
      return
    }

    if (window.explorerAPI?.getThumbnail) {
      window.explorerAPI.getThumbnail(item.path).then((res) => {
        if (isMounted && res && res.success) {
          globalThumbCache.set(item.path, res)
          setThumb(res)
        }
      }).catch(() => {})
    }

    return () => { isMounted = false }
  }, [item.path, isImage, isDoc])

  // --- DETAILS VIEW (Compact 22px Icon / Thumbnail) ---
  if (mode === 'details') {
    if (thumb?.thumbnail) {
      return (
        <div className="w-5 h-5 rounded overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center shadow-sm">
          <img src={thumb.thumbnail} alt="" className="w-full h-full object-cover" />
        </div>
      )
    }
    if (isImage) {
      return (
        <div className="w-5 h-5 rounded overflow-hidden flex-shrink-0 bg-purple-100 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 flex items-center justify-center">
          <FileImage className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
        </div>
      )
    }
    if (ext === '.pdf') {
      return (
        <div className="w-5 h-5 rounded overflow-hidden flex-shrink-0 bg-rose-100 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 flex items-center justify-center">
          <span className="text-[8px] font-black font-mono text-rose-700 dark:text-rose-400">PDF</span>
        </div>
      )
    }
    return <FileIcon item={item} className={className || "w-4 h-4"} />
  }

  // --- GRID VIEW (Large Rich Canvas Thumbnail) ---
  if (item.isDirectory) {
    return (
      <div className="w-full h-24 flex flex-col items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-400/50 shadow-sm transition-all">
        <Folder className="w-12 h-12 text-amber-500 fill-amber-500/25 stroke-[1.4]" />
      </div>
    )
  }

  // 1. Image Thumbnail
  if (isImage) {
    if (thumb?.thumbnail) {
      return (
        <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 group-hover:border-indigo-500 shadow-md relative transition-all flex items-center justify-center">
          <img
            src={thumb.thumbnail}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute bottom-1 right-1.5 px-1 py-0.2 rounded bg-black/75 backdrop-blur-sm text-[9px] font-mono font-bold text-white uppercase tracking-wider">
            {ext.replace('.', '')}
          </span>
        </div>
      )
    }
    return (
      <div className="w-full h-24 rounded-xl overflow-hidden bg-gradient-to-b from-purple-100 to-white dark:from-purple-950/30 dark:to-slate-900 border border-purple-300 dark:border-purple-500/30 group-hover:border-purple-400/60 shadow-sm flex flex-col items-center justify-center gap-1.5 transition-all">
        <FileImage className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        <span className="text-[10px] text-purple-700 dark:text-purple-300 font-mono uppercase font-semibold">Image</span>
      </div>
    )
  }

  // 2. Rich Documents (PDF, Office, Pages, Keynote, Numbers)
  if (isRichDoc) {
    const docBadge = ext.replace('.', '').toUpperCase()
    if (thumb?.thumbnail) {
      return (
        <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-rose-300 dark:border-rose-500/30 group-hover:border-rose-400 shadow-sm relative transition-all flex items-center justify-center p-2">
          <img src={thumb.thumbnail} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
          <span className="absolute top-1 left-1.5 px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black font-mono shadow-sm">
            {docBadge}
          </span>
        </div>
      )
    }
    return (
      <div className="w-full h-24 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/30 group-hover:border-rose-400 shadow-sm flex flex-col p-2 text-left justify-between transition-all">
        <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-500/30 pb-1">
          <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black font-mono">
            {docBadge}
          </span>
          <FileText className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
        </div>
        <div className="space-y-1 my-1">
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
          <div className="h-1.5 bg-slate-300 dark:bg-slate-800 rounded w-full" />
          <div className="h-1.5 bg-slate-300 dark:bg-slate-800 rounded w-3/4" />
        </div>
        <span className="text-[9px] text-rose-700 dark:text-rose-300 font-mono truncate font-semibold">{item.name}</span>
      </div>
    )
  }

  // 3. Text / Markdown / Code Document Snippet Thumbnail
  if (isTextDoc) {
    const docExt = ext.replace('.', '').toUpperCase()
    return (
      <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-flow-borderDark/70 group-hover:border-indigo-400 shadow-sm flex flex-col p-2 text-left justify-between transition-all relative">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-flow-borderDark/40 pb-1">
          <span className="px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[9px] font-bold font-mono">
            {docExt || 'DOC'}
          </span>
          <FileCode className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        </div>
        <div className="flex-1 my-1 overflow-hidden font-mono text-[9px] leading-tight text-slate-700 dark:text-slate-300 whitespace-pre-wrap select-none opacity-90">
          {thumb?.snippet || `${item.name}\n---\nDocument Preview`}
        </div>
        <div className="h-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full w-full" />
      </div>
    )
  }

  // 4. Audio / Video / Archives Fallback
  return (
    <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#121620] border border-slate-200 dark:border-flow-borderDark/60 group-hover:border-indigo-500/40 shadow-sm flex flex-col items-center justify-center gap-1.5 transition-all">
      <FileIcon item={item} className="w-10 h-10" />
      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono uppercase font-medium">{ext.replace('.', '') || 'FILE'}</span>
    </div>
  )
}

// --- Interactive Disk Usage Breakdown Widget (Matching Native Design) ---
function DiskUsageWidget({
  breakdown,
  loading,
  onOpenJunk,
  onOpenDuplicates,
  onOpenApps,
  onOpenLargeOld
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const usedPercent = breakdown?.usedPercent || 73
  const total = breakdown?.totalBytes || 500 * 1024 * 1024 * 1024

  const junkBytes = breakdown?.categories?.junk?.bytes || 111 * 1024 * 1024 * 1024
  const dupBytes = breakdown?.categories?.duplicates?.bytes || 3.49 * 1024 * 1024 * 1024
  const appsBytes = breakdown?.categories?.apps?.bytes || 14.8 * 1024 * 1024 * 1024
  const largeBytes = breakdown?.categories?.largeOld?.bytes || 3.83 * 1024 * 1024 * 1024

  // Width percentages on the bar
  const junkPct = Math.max(4, Math.min(65, (junkBytes / total) * 100))
  const dupPct = Math.max(2.5, Math.min(25, (dupBytes / total) * 100 * 4))
  const appsPct = Math.max(5, Math.min(35, (appsBytes / total) * 100))
  const largePct = Math.max(2.5, Math.min(20, (largeBytes / total) * 100 * 3))

  return (
    <div className="w-full rounded-xl bg-white dark:bg-[#141620] border border-slate-200 dark:border-white/10 p-3 shadow-sm select-none transition-all">
      {/* Header */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-1.5">
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-transform duration-200 ${
              isExpanded ? '' : '-rotate-90'
            }`}
          />
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px] tracking-tight">
            Disk Usage
          </span>
        </div>
        <span className="text-base font-extrabold text-[#F97316] font-mono tracking-tight drop-shadow-sm">
          {usedPercent}%
        </span>
      </div>

      {/* Segmented Horizontal Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center gap-[2px] p-[2px] my-2.5 shadow-inner">
        <div
          style={{ width: `${junkPct}%` }}
          className="h-full rounded-l-full bg-[#5E72EB] transition-all duration-500 hover:brightness-110"
          title={`Junk Files: ${formatBytes(junkBytes)}`}
        />
        <div
          style={{ width: `${dupPct}%` }}
          className="h-full bg-[#A855F7] transition-all duration-500 hover:brightness-110"
          title={`Duplicate Files: ${formatBytes(dupBytes)}`}
        />
        <div
          style={{ width: `${appsPct}%` }}
          className="h-full bg-[#F97316] transition-all duration-500 hover:brightness-110"
          title={`Applications: ${formatBytes(appsBytes)}`}
        />
        <div
          style={{ width: `${largePct}%` }}
          className="h-full rounded-r-full bg-[#FACC15] transition-all duration-500 hover:brightness-110"
          title={`Large & Old Files: ${formatBytes(largeBytes)}`}
        />
      </div>

      {/* Expandable Category Rows */}
      {isExpanded && (
        <div className="flex flex-col gap-1 pt-0.5 text-xs">
          {/* 1. Junk Files */}
          <div
            onClick={onOpenJunk}
            className="flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#5E72EB] shadow-[0_0_8px_rgba(94,114,235,0.6)] flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium text-[12px]">
                Junk Files
              </span>
            </div>
            <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold text-[12px]">
              {formatBytes(junkBytes)}
            </span>
          </div>

          {/* 2. Duplicate Files */}
          <div
            onClick={onOpenDuplicates}
            className="flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.6)] flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium text-[12px]">
                Duplicate Files
              </span>
            </div>
            <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold text-[12px]">
              {formatBytes(dupBytes)}
            </span>
          </div>

          {/* 3. Applications */}
          <div
            onClick={onOpenApps}
            className="flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.6)] flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium text-[12px]">
                Applications
              </span>
            </div>
            <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold text-[12px]">
              {formatBytes(appsBytes)}
            </span>
          </div>

          {/* 4. Large & Old Files */}
          <div
            onClick={onOpenLargeOld}
            className="flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15] shadow-[0_0_8px_rgba(250,204,21,0.6)] flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium text-[12px]">
                Large & Old Files
              </span>
            </div>
            <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold text-[12px]">
              {formatBytes(largeBytes)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Signature "My Computer / This Mac" Screen (Inspired by mac-explorer.com) ---
function MyComputerScreen({ volumes, diskStats, diskBreakdown, onNavigate, onOpenCleaner, onOpenUninstaller, onOpenPerf, homePath }) {
  const quickFolders = [
    { name: 'Desktop', path: `${homePath}/Desktop`, icon: Folder, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Documents', path: `${homePath}/Documents`, icon: FileText, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { name: 'Downloads', path: `${homePath}/Downloads`, icon: Download, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Projects', path: `${homePath}/Projects`, icon: Code2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Pictures', path: `${homePath}/Pictures`, icon: FileImage, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { name: 'Home', path: homePath, icon: Home, color: 'text-rose-400', bg: 'bg-rose-500/10' }
  ]

  const freeGB = diskStats?.freeBytes ? (diskStats.freeBytes / (1024 ** 3)).toFixed(1) : '135.0'
  const totalGB = diskStats?.totalBytes ? (diskStats.totalBytes / (1024 ** 3)).toFixed(1) : '500.0'
  const usedPercent = diskStats?.usedPercent || 72

  return (
    <div className="h-full flex-1 overflow-y-auto p-8 select-none space-y-8 no-scrollbar">
      {/* Hero Welcome / Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-lg mac-specular">
            <HardDrive className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">This Mac</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                APFS Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              macOS System Explorer • Unified Storage & Connected Volumes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCleaner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reclaim Space</span>
          </button>
          <button
            onClick={onOpenPerf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span>Boost Performance</span>
          </button>
        </div>
      </div>

      {/* Internal & External Drives Section */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Storage & Volumes</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Macintosh HD Main Drive Card */}
          <div
            onClick={() => onNavigate('/')}
            className="mac-glass-card p-5 rounded-2xl flex flex-col gap-3 group cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    Macintosh HD
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Internal Apple SSD • APFS System</div>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
                {freeGB} GB free
              </span>
            </div>

            {/* Storage Meter Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, usedPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>{usedPercent}% used of {totalGB} GB</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">Browse Drive →</span>
            </div>
          </div>

          {/* User Home Drive Card */}
          <div
            onClick={() => onNavigate(homePath)}
            className="mac-glass-card p-5 rounded-2xl flex flex-col gap-3 group cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-500 dark:text-purple-400 group-hover:scale-105 transition-transform">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    User Home Directory
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono truncate max-w-[200px]">{homePath}</div>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-500/20">
                User Space
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: '60%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>Personal Documents & Projects</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">Open Home →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Folders Grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Quick Access Favorites</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickFolders.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.path}
                onClick={() => onNavigate(f.path)}
                className="mac-glass-card p-4 rounded-xl flex flex-col items-center text-center gap-2.5 group cursor-pointer transition-all"
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} border border-slate-200/50 dark:border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors truncate w-full">
                  {f.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Live Disk Category Breakdown Overview (CleanMyMac / Mac Explorer style) */}
      {diskBreakdown?.categories && (
        <div className="mac-glass-card p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Disk Space Categorization</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Deep telemetry of local caches, applications, and recoverable gigabytes</p>
            </div>
            <button
              onClick={onOpenCleaner}
              className="px-3 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              Analyze Disk
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">Junk & Cache Files</span>
              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {(diskBreakdown.categories.junk.bytes / (1024 ** 3)).toFixed(1)} GB
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">Duplicate Files</span>
              <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                {(diskBreakdown.categories.duplicates.bytes / (1024 ** 3)).toFixed(1)} GB
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">Installed Apps</span>
              <div className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                {(diskBreakdown.categories.apps.bytes / (1024 ** 3)).toFixed(1)} GB
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">Large & Old Files</span>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {(diskBreakdown.categories.largeOld.bytes / (1024 ** 3)).toFixed(1)} GB
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('flow_theme') || 'dark')

  useEffect(() => {
    localStorage.setItem('flow_theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Multi-Tabs State
  const [tabs, setTabs] = useState([
    { id: 'tab-1', path: '', name: 'Home', history: [], historyIndex: 0 }
  ])
  const [activeTabId, setActiveTabId] = useState('tab-1')

  // Quick Access Volumes & System Stats
  const [volumes, setVolumes] = useState([])
  const [sidebarData, setSidebarData] = useState({
    favorites: [],
    cloudLocations: [],
    deviceLocations: [],
    removableVolumes: [],
    airdrop: { name: 'AirDrop', path: 'airdrop', type: 'airdrop' },
    trash: { name: 'Bin', path: '', type: 'trash' },
    computerName: 'MacBook Air',
    primaryDiskName: 'Jagan'
  })
  const [diskStats, setDiskStats] = useState({ freeBytes: 0, totalBytes: 0, usedPercent: 0 })
  const [gitInfo, setGitInfo] = useState({ isGit: false, branch: '', modifiedCount: 0, untrackedCount: 0 })

  // Pinned Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flow_favorites')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('flow_favorites', JSON.stringify(favorites))
  }, [favorites])

  // File Tags Map
  const [fileTags, setFileTags] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flow_file_tags')) || {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('flow_file_tags', JSON.stringify(fileTags))
  }, [fileTags])

  // --- COLUMN & PANE DRAG RESIZING STATE ---
  // 1. Details Table Column Widths (Name, Date Modified, Type, Size)
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const saved = localStorage.getItem('flow_column_widths')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      name: 290,
      mtime: 150,
      extension: 110,
      size: 90,
      permissions: 85,
      owner: 90
    }
  })

  useEffect(() => {
    localStorage.setItem('flow_column_widths', JSON.stringify(columnWidths))
  }, [columnWidths])

  const startColResize = useCallback((colKey, e) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startW = columnWidths[colKey]

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX
      const minWidths = { name: 140, mtime: 100, extension: 80, size: 70, permissions: 70, owner: 70 }
      const newWidth = Math.max(minWidths[colKey] || 70, startW + delta)
      setColumnWidths((prev) => ({
        ...prev,
        [colKey]: newWidth
      }))
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [columnWidths])

  // 2. Left Sidebar Width (Drag Resizable)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('flow_sidebar_width')
      if (saved) return parseInt(saved, 10)
    } catch {}
    return 220
  })

  useEffect(() => {
    localStorage.setItem('flow_sidebar_width', sidebarWidth.toString())
  }, [sidebarWidth])

  const startSidebarResize = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startW = sidebarWidth

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX
      const nextW = Math.max(160, Math.min(420, startW + delta))
      setSidebarWidth(nextW)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [sidebarWidth])

  // 3. Right Inspector Pane Width (Drag Resizable)
  const [inspectorWidth, setInspectorWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('flow_inspector_width')
      if (saved) return parseInt(saved, 10)
    } catch {}
    return 320
  })

  useEffect(() => {
    localStorage.setItem('flow_inspector_width', inspectorWidth.toString())
  }, [inspectorWidth])

  const startInspectorResize = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startW = inspectorWidth

    const onMouseMove = (moveEvent) => {
      const delta = startX - moveEvent.clientX
      const nextW = Math.max(220, Math.min(560, startW + delta))
      setInspectorWidth(nextW)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [inspectorWidth])

  // 4. Dual-Pane Split Ratio (Drag Resizable & Persisted)
  const [splitRatio, setSplitRatio] = useState(() => {
    try {
      const saved = localStorage.getItem('flow_split_ratio')
      return saved ? Number(saved) : 50
    } catch {
      return 50
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('flow_split_ratio', splitRatio.toString())
    } catch {}
  }, [splitRatio])

  const startSplitResize = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const container = e.currentTarget.parentElement
    if (!container) return
    const rect = container.getBoundingClientRect()

    const onMouseMove = (moveEvent) => {
      const offset = moveEvent.clientX - rect.left
      const ratio = Math.max(20, Math.min(80, (offset / rect.width) * 100))
      setSplitRatio(ratio)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  // Persisted Explorer Layout & View Preferences
  const [isDualPane, setIsDualPane] = useState(() => {
    try {
      const saved = localStorage.getItem('flow_is_dual_pane')
      return saved !== null ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('flow_is_dual_pane', JSON.stringify(isDualPane))
    } catch {}
  }, [isDualPane])

  const [showInspector, setShowInspector] = useState(() => {
    try {
      const saved = localStorage.getItem('flow_show_inspector')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('flow_show_inspector', JSON.stringify(showInspector))
    } catch {}
  }, [showInspector])

  const savedViewMode = useMemo(() => {
    try {
      return localStorage.getItem('flow_view_mode') || 'details'
    } catch {
      return 'details'
    }
  }, [])

  const savedShowHidden = useMemo(() => {
    try {
      const s = localStorage.getItem('flow_show_hidden')
      return s !== null ? JSON.parse(s) : false
    } catch {
      return false
    }
  }, [])

  const savedSortField = useMemo(() => {
    try {
      return localStorage.getItem('flow_sort_field') || 'name'
    } catch {
      return 'name'
    }
  }, [])

  const savedSortDirection = useMemo(() => {
    try {
      return localStorage.getItem('flow_sort_direction') || 'asc'
    } catch {
      return 'asc'
    }
  }, [])

  const [restoreLastFolder, setRestoreLastFolder] = useState(() => {
    try {
      const s = localStorage.getItem('flow_restore_last_folder')
      return s !== null ? JSON.parse(s) : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('flow_restore_last_folder', JSON.stringify(restoreLastFolder))
    } catch {}
  }, [restoreLastFolder])

  // Panes State
  const [activePane, setActivePane] = useState('left')

  const [leftPane, setLeftPane] = useState({
    path: '',
    items: [],
    history: [],
    historyIndex: -1,
    selectedPaths: new Set(),
    filterQuery: '',
    categoryFilter: 'all',
    tagFilter: null,
    showHidden: savedShowHidden,
    viewMode: savedViewMode,
    sortField: savedSortField,
    sortDirection: savedSortDirection
  })

  const [rightPane, setRightPane] = useState({
    path: '',
    items: [],
    history: [],
    historyIndex: -1,
    selectedPaths: new Set(),
    filterQuery: '',
    categoryFilter: 'all',
    tagFilter: null,
    showHidden: savedShowHidden,
    viewMode: savedViewMode,
    sortField: savedSortField,
    sortDirection: savedSortDirection
  })

  // Omnibar Address Edit Mode State
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [addressInputVal, setAddressInputVal] = useState('')
  const addressInputRef = useRef(null)

  // Live Inspector Preview Pane & Checksum
  const [previewData, setPreviewData] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [hashResult, setHashResult] = useState({ sha256: '', md5: '', loading: false })

  // Quick Look Overlay Modal (Space trigger)
  const [quickLookItem, setQuickLookItem] = useState(null)

  // Inbuilt Photo Gallery State (Next & Prev Lightbox)
  const [photoGallery, setPhotoGallery] = useState({
    isOpen: false,
    items: [],
    currentIndex: 0,
    zoom: 1,
    rotation: 0,
    isFlipped: false,
    isPlaying: false,
    previewData: null,
    loading: false
  })
  const filmstripRef = useRef(null)

  // Default File Manager & Preferences Modal State
  const [showDefaultManagerModal, setShowDefaultManagerModal] = useState(false)
  const [useInbuiltGallery, setUseInbuiltGallery] = useState(() => {
    try {
      const saved = localStorage.getItem('flow_use_inbuilt_gallery')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })
  const [loginItemStatus, setLoginItemStatus] = useState(() => {
    try {
      const s = localStorage.getItem('flow_login_item_status')
      return s !== null ? JSON.parse(s) : false
    } catch {
      return false
    }
  })
  const [systemMenuOpen, setSystemMenuOpen] = useState(false)

  // Clipboard State (Windows Explorer operation + sourceDir tracking)
  const [clipboard, setClipboard] = useState({
    operation: null,
    items: [],
    sourceDir: '',
    sourcePane: 'left'
  })

  // Windows Explorer Undo History Stack
  const [undoStack, setUndoStack] = useState([])

  // Windows Explorer Shift+Click range selection anchor
  const lastSelectedPathRef = useRef(null)

  // Permanent Delete Modal State (Shift+Delete Windows Mechanic)
  const [permDeleteModal, setPermDeleteModal] = useState({
    isOpen: false,
    paths: []
  })

  // Holding Tray / Drop Shelf
  const [shelfItems, setShelfItems] = useState([])
  const [shelfOpen, setShelfOpen] = useState(false)

  // Inline Renaming State
  const [renamingItemPath, setRenamingItemPath] = useState(null)
  const [renamingNewName, setRenamingNewName] = useState('')
  const renameInputRef = useRef(null)

  // New Folder / File Dialog State
  const [newItemDialog, setNewItemDialog] = useState({
    isOpen: false,
    type: 'folder',
    name: ''
  })
  const newItemInputRef = useRef(null)

  // Batch Renamer Modal State
  const [batchRenameModal, setBatchRenameModal] = useState({
    isOpen: false,
    findText: '',
    replaceText: '',
    prefix: '',
    suffix: '',
    numbering: false,
    caseTransform: 'none'
  })

  // --- NEW FEATURE 1: Smart Folder Reorganizer State (AI Powered) ---
  const [reorganizeModal, setReorganizeModal] = useState({
    isOpen: false,
    strategy: 'ai', // 'ai' | 'type' | 'date' | 'extension'
    previewMoves: [],
    categoryCounts: {},
    selectedMoves: new Set(),
    categoryFilter: 'all',
    searchFilter: '',
    editingSrc: null,
    editingFolderName: '',
    loading: false
  })

  // --- NEW FEATURE 2: Storage Optimizer & Temp Junk Cleaner State ---
  const [cleanerModal, setCleanerModal] = useState({
    isOpen: false,
    scanning: false,
    cleaning: false,
    junkItems: [],
    selectedJunkPaths: new Set(),
    totalReclaimable: 0
  })

  // --- BIG FEATURE 1: App Uninstaller & Deep Residual Cleaner State ---
  const [uninstallerModal, setUninstallerModal] = useState({
    isOpen: false,
    tab: 'apps', // 'apps' | 'orphans'
    loading: false,
    apps: [],
    searchQuery: '',
    selectedApp: null,
    appDetailsLoading: false,
    appFootprint: null,
    selectedPathsToClean: new Set(),
    orphanItems: [],
    orphanLoading: false,
    selectedOrphanPaths: new Set(),
    uninstalling: false
  })

  // --- BIG FEATURE 2: Performance Improvement Enhancer & Task Manager State ---
  const [perfModal, setPerfModal] = useState({
    isOpen: false,
    stats: null,
    processes: [],
    processFilter: '',
    sortBy: 'cpu', // 'cpu' | 'mem'
    loading: false,
    autoRefresh: true,
    optimizingMemory: false,
    flushingDns: false,
    cleaningQuicklook: false
  })

  // --- Disk Breakdown Telemetry State ---
  const [diskBreakdown, setDiskBreakdown] = useState(null)
  const [diskBreakdownLoading, setDiskBreakdownLoading] = useState(false)

  // --- Duplicate Files Cleaner Modal State ---
  const [duplicateModal, setDuplicateModal] = useState({
    isOpen: false,
    scanning: false,
    cleaning: false,
    groups: [],
    selectedPaths: new Set(),
    totalDuplicatesCount: 0,
    totalReclaimableBytes: 0
  })

  // --- Large & Old Files Manager Modal State ---
  const [largeOldModal, setLargeOldModal] = useState({
    isOpen: false,
    scanning: false,
    trashing: false,
    files: [],
    selectedPaths: new Set(),
    totalBytes: 0,
    filter: 'all' // 'all' | 'huge' (>500MB) | 'old' (>90d)
  })

  // In-App Terminal Drawer State (Ctrl + `)
  const [terminalDrawerOpen, setTerminalDrawerOpen] = useState(false)
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'FlowExplorer CLI Ready. Press Ctrl+` to toggle.' }
  ])
  const [terminalInputVal, setTerminalInputVal] = useState('')
  const terminalInputRef = useRef(null)

  // Command Palette State (Cmd + K)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [commandSelectedIndex, setCommandSelectedIndex] = useState(0)
  const commandInputRef = useRef(null)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)
  const [isRegExpMode, setIsRegExpMode] = useState(false)

  // Custom Context Menu State
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
    pane: 'left'
  })

  // Toast Notification System
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  // Window Fullscreen State & Controller
  const [isWindowFullScreen, setIsWindowFullScreen] = useState(false)

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (api.toggleFullScreen) {
        const isFS = await api.toggleFullScreen()
        setIsWindowFullScreen(!!isFS)
        addToast(isFS ? 'Entered Fullscreen Mode' : 'Exited Fullscreen Mode', 'info')
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err)
    }
  }, [addToast])

  useEffect(() => {
    if (api.isFullScreen) {
      api.isFullScreen().then((fs) => setIsWindowFullScreen(!!fs)).catch(() => {})
    }
  }, [])

  const currentPaneState = activePane === 'left' ? leftPane : rightPane
  const setCurPaneState = useCallback((updater) => {
    if (activePane === 'left') {
      setLeftPane(updater)
    } else {
      setRightPane(updater)
    }
  }, [activePane])

  // Persisted viewMode, showHidden, and sort handlers
  const updateViewMode = useCallback((mode) => {
    try {
      localStorage.setItem('flow_view_mode', mode)
    } catch {}
    setLeftPane((prev) => ({ ...prev, viewMode: mode }))
    setRightPane((prev) => ({ ...prev, viewMode: mode }))
  }, [])

  const toggleShowHidden = useCallback(() => {
    setLeftPane((prev) => {
      const next = !prev.showHidden
      try {
        localStorage.setItem('flow_show_hidden', JSON.stringify(next))
      } catch {}
      return { ...prev, showHidden: next }
    })
    setRightPane((prev) => ({ ...prev, showHidden: !prev.showHidden }))
  }, [])

  const handleSortChange = useCallback((paneName, field) => {
    const setter = paneName === 'left' ? setLeftPane : setRightPane
    setter((prev) => {
      const nextDir = prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
      try {
        localStorage.setItem('flow_sort_field', field)
        localStorage.setItem('flow_sort_direction', nextDir)
      } catch {}
      return {
        ...prev,
        sortField: field,
        sortDirection: nextDir
      }
    })
  }, [])

  const handleResetSettings = useCallback(() => {
    if (!window.confirm('Reset all settings, views, and preferences to factory defaults?')) return
    const keysToRemove = [
      'flow_theme', 'flow_view_mode', 'flow_show_hidden', 'flow_sort_field',
      'flow_sort_direction', 'flow_is_dual_pane', 'flow_show_inspector',
      'flow_split_ratio', 'flow_restore_last_folder', 'flow_last_path',
      'flow_use_inbuilt_gallery', 'flow_column_widths', 'flow_sidebar_width',
      'flow_inspector_width', 'flow_login_item_status'
    ]
    keysToRemove.forEach((k) => {
      try { localStorage.removeItem(k) } catch {}
    })
    setTheme('dark')
    setIsDualPane(false)
    setShowInspector(true)
    setSplitRatio(50)
    setUseInbuiltGallery(true)
    setRestoreLastFolder(true)
    updateViewMode('details')
    setLeftPane((prev) => ({
      ...prev,
      showHidden: false,
      viewMode: 'details',
      sortField: 'name',
      sortDirection: 'asc'
    }))
    setRightPane((prev) => ({
      ...prev,
      showHidden: false,
      viewMode: 'details',
      sortField: 'name',
      sortDirection: 'asc'
    }))
    addToast('All preferences reset to factory defaults', 'success')
  }, [updateViewMode, addToast])

  const refreshSidebar = useCallback(async () => {
    try {
      const vols = await api.getVolumes()
      if (vols && typeof vols === 'object' && !Array.isArray(vols)) {
        setSidebarData(vols)
        setVolumes(vols.flat || [])
      } else if (Array.isArray(vols)) {
        setVolumes(vols)
        setSidebarData((prev) => ({ ...prev, favorites: vols }))
      }
    } catch {}
  }, [])

  const handleEjectVolume = useCallback(async (volume, e) => {
    if (e) e.stopPropagation()
    if (!api.ejectVolume) return
    const res = await api.ejectVolume(volume.path)
    if (res.success) {
      addToast(`Ejected "${volume.name}"`, 'success')
      refreshSidebar()
    } else {
      addToast(`Could not eject "${volume.name}": ${res.error || 'Disk in use'}`, 'error')
    }
  }, [addToast, refreshSidebar])

  // Initial Mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const home = await api.getHome()
        const vols = await api.getVolumes()
        if (vols && typeof vols === 'object' && !Array.isArray(vols)) {
          setSidebarData(vols)
          setVolumes(vols.flat || [])
        } else if (Array.isArray(vols)) {
          setVolumes(vols)
          setSidebarData((prev) => ({ ...prev, favorites: vols }))
        }

        if (api.getDiskSpace) {
          const stats = await api.getDiskSpace()
          if (stats.success) setDiskStats(stats)
        }

        let startPath = home
        try {
          const shouldRestore = localStorage.getItem('flow_restore_last_folder') !== 'false'
          const savedPath = localStorage.getItem('flow_last_path')
          if (shouldRestore && savedPath && savedPath !== 'my-computer') {
            startPath = savedPath
          }
        } catch {}

        setLeftPane((prev) => ({
          ...prev,
          path: startPath,
          history: [startPath],
          historyIndex: 0
        }))

        const downloads = `${home}/Downloads`
        setRightPane((prev) => ({
          ...prev,
          path: downloads,
          history: [downloads],
          historyIndex: 0
        }))

        const initialFolderName = startPath === '/' ? 'Macintosh HD' : startPath.split('/').pop() || 'Home'
        setTabs([{ id: 'tab-1', path: startPath, name: initialFolderName, history: [startPath], historyIndex: 0 }])
      } catch (err) {
        addToast(`Initialization error: ${err.message}`, 'error')
      }
    }
    initialize()
  }, [addToast])

  useEffect(() => {
    if (leftPane.path && leftPane.path !== 'my-computer' && restoreLastFolder) {
      try {
        localStorage.setItem('flow_last_path', leftPane.path)
      } catch {}
    }
  }, [leftPane.path, restoreLastFolder])

  // Load directory items
  const loadDirectory = useCallback(async (targetPane, targetPath, options = {}) => {
    if (!targetPath) return
    const paneSetter = targetPane === 'left' ? setLeftPane : setRightPane
    if (targetPath === 'my-computer') {
      paneSetter((prev) => ({
        ...prev,
        path: 'my-computer',
        items: [],
        selectedPaths: new Set()
      }))
      return
    }
    try {
      const showHidden = options.showHidden ?? (targetPane === 'left' ? leftPane.showHidden : rightPane.showHidden)
      const res = await api.readDir(targetPath, { showHidden })

      if (!res.success) {
        addToast(`Permission/Read error: ${res.error || res.code}`, 'error')
        return
      }

      paneSetter((prev) => ({
        ...prev,
        path: res.path,
        items: res.items,
        selectedPaths: new Set()
      }))

      if (api.getGitStatus) {
        api.getGitStatus(res.path).then((g) => setGitInfo(g))
      }
    } catch (err) {
      addToast(`Error: ${err.message}`, 'error')
    }
  }, [addToast, leftPane.showHidden, rightPane.showHidden])

  useEffect(() => {
    if (leftPane.path) {
      loadDirectory('left', leftPane.path, { showHidden: leftPane.showHidden })
    }
  }, [leftPane.path, leftPane.showHidden, loadDirectory])

  useEffect(() => {
    if (isDualPane && rightPane.path) {
      loadDirectory('right', rightPane.path, { showHidden: rightPane.showHidden })
    }
  }, [isDualPane, rightPane.path, rightPane.showHidden, loadDirectory])

  useEffect(() => {
    if (leftPane.path) {
      const folderName = leftPane.path === '/' ? 'Macintosh HD' : leftPane.path.split('/').pop() || 'Folder'
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, path: leftPane.path, name: folderName } : t))
      )
    }
  }, [leftPane.path, activeTabId])

  // Selected item for Inspector
  const selectedItemForPreview = useMemo(() => {
    const pane = currentPaneState
    const sel = Array.from(pane.selectedPaths)
    if (sel.length === 1) {
      return pane.items.find((i) => i.path === sel[0]) || null
    }
    return null
  }, [currentPaneState])

  useEffect(() => {
    if (!showInspector || !selectedItemForPreview || selectedItemForPreview.isDirectory) {
      setPreviewData(null)
      setHashResult({ sha256: '', md5: '', loading: false })
      return
    }

    let isSubscribed = true
    setPreviewLoading(true)
    api.readPreview(selectedItemForPreview.path).then((res) => {
      if (isSubscribed) {
        setPreviewData(res.success ? res : null)
        setPreviewLoading(false)
      }
    }).catch(() => {
      if (isSubscribed) {
        setPreviewData(null)
        setPreviewLoading(false)
      }
    })

    return () => {
      isSubscribed = false
    }
  }, [selectedItemForPreview, showInspector])

  const computeFileHash = useCallback(async () => {
    if (!selectedItemForPreview || selectedItemForPreview.isDirectory) return
    setHashResult((prev) => ({ ...prev, loading: true }))
    if (api.calcHash) {
      const res = await api.calcHash(selectedItemForPreview.path)
      if (res.success) {
        setHashResult({ sha256: res.sha256, md5: res.md5, loading: false })
        addToast('Calculated SHA-256 and MD5', 'success')
      } else {
        setHashResult({ sha256: '', md5: '', loading: false })
        addToast('Hash calculation failed', 'error')
      }
    }
  }, [selectedItemForPreview, addToast])

  // Navigation Controls
  const navigateTo = useCallback((newPath, targetPane = activePane) => {
    const paneSetter = targetPane === 'left' ? setLeftPane : setRightPane
    paneSetter((prev) => {
      const cleanNew = newPath.replace(/\/+$/, '') || '/'
      if (cleanNew === prev.path) return prev
      const newHistory = prev.history.slice(0, prev.historyIndex + 1)
      newHistory.push(cleanNew)
      return {
        ...prev,
        path: cleanNew,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedPaths: new Set(),
        filterQuery: '',
        categoryFilter: 'all',
        tagFilter: null
      }
    })
  }, [activePane])

  const goBack = useCallback((targetPane = activePane) => {
    const paneSetter = targetPane === 'left' ? setLeftPane : setRightPane
    paneSetter((prev) => {
      if (prev.historyIndex > 0) {
        const nextIdx = prev.historyIndex - 1
        return {
          ...prev,
          path: prev.history[nextIdx],
          historyIndex: nextIdx,
          selectedPaths: new Set(),
          filterQuery: '',
          categoryFilter: 'all',
          tagFilter: null
        }
      }
      return prev
    })
  }, [activePane])

  const goForward = useCallback((targetPane = activePane) => {
    const paneSetter = targetPane === 'left' ? setLeftPane : setRightPane
    paneSetter((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        const nextIdx = prev.historyIndex + 1
        return {
          ...prev,
          path: prev.history[nextIdx],
          historyIndex: nextIdx,
          selectedPaths: new Set(),
          filterQuery: '',
          categoryFilter: 'all',
          tagFilter: null
        }
      }
      return prev
    })
  }, [activePane])

  const goUpOneLevel = useCallback((targetPane = activePane) => {
    const currentPath = targetPane === 'left' ? leftPane.path : rightPane.path
    if (currentPath === '/' || !currentPath) return
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    const parentPath = '/' + parts.join('/')
    navigateTo(parentPath, targetPane)
  }, [activePane, leftPane.path, rightPane.path, navigateTo])

  const refreshCurrent = useCallback(() => {
    loadDirectory(activePane, currentPaneState.path)
    addToast('Refreshed directory', 'info')
  }, [activePane, currentPaneState.path, loadDirectory, addToast])

  // Tab Controls
  const handleNewTab = useCallback(async () => {
    const home = await api.getHome()
    const newTabId = `tab-${Date.now()}`
    const newTab = { id: newTabId, path: home, name: 'Home', history: [home], historyIndex: 0 }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newTabId)
    setLeftPane((prev) => ({
      ...prev,
      path: home,
      history: [home],
      historyIndex: 0,
      selectedPaths: new Set()
    }))
  }, [])

  const handleCloseTab = useCallback((tabIdToClose, e) => {
    if (e) e.stopPropagation()
    if (tabs.length <= 1) return
    const index = tabs.findIndex((t) => t.id === tabIdToClose)
    const remaining = tabs.filter((t) => t.id !== tabIdToClose)
    setTabs(remaining)

    if (activeTabId === tabIdToClose) {
      const nextTab = remaining[Math.max(0, index - 1)]
      setActiveTabId(nextTab.id)
      setLeftPane((prev) => ({
        ...prev,
        path: nextTab.path,
        history: nextTab.history,
        historyIndex: nextTab.historyIndex,
        selectedPaths: new Set()
      }))
    }
  }, [tabs, activeTabId])

  const handleSwitchTab = useCallback((tab) => {
    setActiveTabId(tab.id)
    setLeftPane((prev) => ({
      ...prev,
      path: tab.path,
      history: tab.history,
      historyIndex: tab.historyIndex,
      selectedPaths: new Set()
    }))
  }, [])

  const toggleFavorite = useCallback((itemPath) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.path === itemPath)
      if (exists) {
        addToast('Removed from Pinned Favorites', 'info')
        return prev.filter((f) => f.path !== itemPath)
      } else {
        const name = itemPath.split('/').pop() || 'Root'
        addToast(`Pinned "${name}" to Favorites`, 'success')
        return [...prev, { name, path: itemPath }]
      }
    })
  }, [addToast])

  const setItemTag = useCallback((itemPath, colorName) => {
    setFileTags((prev) => {
      if (prev[itemPath] === colorName) {
        const next = { ...prev }
        delete next[itemPath]
        addToast('Tag removed', 'info')
        return next
      } else {
        addToast(`Tagged as ${colorName}`, 'success')
        return { ...prev, [itemPath]: colorName }
      }
    })
  }, [addToast])

  const breadcrumbSegments = useMemo(() => {
    const p = currentPaneState.path
    if (!p) return []
    if (p === 'my-computer') return [{ name: 'This Mac', path: 'my-computer' }]
    const parts = p.split('/').filter(Boolean)
    const segments = [{ name: 'Macintosh HD', path: '/' }]
    let cumulative = ''
    parts.forEach((part) => {
      cumulative += `/${part}`
      segments.push({ name: part, path: cumulative })
    })
    return segments
  }, [currentPaneState.path])

  const copyPathToClipboard = useCallback((pathToCopy) => {
    const p = pathToCopy || currentPaneState.path
    navigator.clipboard.writeText(p)
    addToast(`Copied path: ${p}`, 'success')
  }, [currentPaneState.path, addToast])

  // Sorting & Filtering
  const sortedAndFilteredItems = useMemo(() => {
    const { items, filterQuery, categoryFilter, tagFilter, sortField, sortDirection } = currentPaneState

    let filtered = items
    if (filterQuery.trim()) {
      if (isRegExpMode) {
        try {
          const reg = new RegExp(filterQuery, 'i')
          filtered = filtered.filter((i) => reg.test(i.name) || (i.extension && reg.test(i.extension)))
        } catch {
          const q = filterQuery.toLowerCase()
          filtered = filtered.filter(
            (i) => i.name.toLowerCase().includes(q) || (i.extension && i.extension.toLowerCase().includes(q))
          )
        }
      } else {
        const q = filterQuery.toLowerCase()
        filtered = filtered.filter(
          (i) => i.name.toLowerCase().includes(q) || (i.extension && i.extension.toLowerCase().includes(q))
        )
      }
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((i) => {
        if (categoryFilter === 'folders') return i.isDirectory
        if (i.isDirectory) return false
        const ext = (i.extension || '').toLowerCase()
        if (categoryFilter === 'code') return ['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.py', '.rs', '.go', '.sh', '.yml'].includes(ext)
        if (categoryFilter === 'images') return ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif'].includes(ext)
        if (categoryFilter === 'docs') return ['.pdf', '.doc', '.docx', '.txt', '.md', '.csv', '.xlsx'].includes(ext)
        if (categoryFilter === 'media') return ['.mp3', '.wav', '.ogg', '.m4a', '.mp4', '.mov', '.webm'].includes(ext)
        if (categoryFilter === 'archives') return ['.zip', '.tar', '.gz', '.7z', '.rar'].includes(ext)
        return true
      })
    }

    if (tagFilter) {
      filtered = filtered.filter((i) => fileTags[i.path] === tagFilter)
    }

    return [...filtered].sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1

      let compare = 0
      if (sortField === 'name') {
        compare = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      } else if (sortField === 'size') {
        compare = (a.size || 0) - (b.size || 0)
      } else if (sortField === 'mtime') {
        compare = (a.mtime || 0) - (b.mtime || 0)
      } else if (sortField === 'extension') {
        compare = (a.extension || '').localeCompare(b.extension || '')
      }
      return sortDirection === 'asc' ? compare : -compare
    })
  }, [currentPaneState, fileTags, isRegExpMode])

  // Cut / Copy / Paste / Trash / Permanent Delete / Undo (Windows 11 Explorer Mechanics)
  const handleCut = useCallback(() => {
    const selected = Array.from(currentPaneState.selectedPaths)
    if (selected.length === 0) return
    setClipboard({ operation: 'cut', items: selected, sourceDir: currentPaneState.path, sourcePane: activePane })
    api.writeClipboard?.(selected.join('\n'))
    addToast(`Cut ${selected.length} item(s) (Ctrl+V to move, Esc to cancel)`, 'info')
  }, [currentPaneState.selectedPaths, currentPaneState.path, activePane, addToast])

  const handleCopy = useCallback(() => {
    const selected = Array.from(currentPaneState.selectedPaths)
    if (selected.length === 0) return
    setClipboard({ operation: 'copy', items: selected, sourceDir: currentPaneState.path, sourcePane: activePane })
    api.writeClipboard?.(selected.join('\n'))
    addToast(`Copied ${selected.length} item(s) to clipboard (Ctrl+V to paste)`, 'info')
  }, [currentPaneState.selectedPaths, currentPaneState.path, activePane, addToast])

  const handlePaste = useCallback(async () => {
    let itemsToPaste = clipboard.items || []
    let op = clipboard.operation

    // If internal clipboard is empty, check system clipboard for file paths
    if (itemsToPaste.length === 0 && api.readClipboard) {
      const clipRes = await api.readClipboard()
      if (clipRes?.text) {
        const lines = clipRes.text.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('/'))
        if (lines.length > 0) {
          itemsToPaste = lines
          op = 'copy'
        }
      }
    }

    if (itemsToPaste.length === 0) {
      addToast('Clipboard is empty. Select files and press Ctrl+C or Ctrl+X first.', 'warning')
      return
    }

    const destDir = currentPaneState.path
    if (op === 'cut') {
      if (clipboard.sourceDir === destDir) {
        setClipboard({ operation: null, items: [], sourceDir: '', sourcePane: 'left' })
        addToast('Items already reside in this folder. Cut cancelled.', 'info')
        return
      }
      const res = await api.move(itemsToPaste, destDir)
      if (res.success) {
        addToast(`Moved ${itemsToPaste.length} item(s) to ${destDir.split('/').pop() || 'folder'}`, 'success')
        setUndoStack((prev) => [
          { type: 'move', items: itemsToPaste.map((src) => ({ from: src, to: `${destDir}/${src.split('/').pop()}` })), destDir: clipboard.sourceDir },
          ...prev.slice(0, 19)
        ])
        setClipboard({ operation: null, items: [], sourceDir: '', sourcePane: 'left' })
      } else {
        addToast(`Move failed: ${res.error}`, 'error')
      }
    } else {
      const res = await api.copy(itemsToPaste, destDir)
      if (res.success) {
        const createdFiles = res.results?.filter((r) => r.success).map((r) => r.dest) || []
        addToast(`Copied ${itemsToPaste.length} item(s) to ${destDir.split('/').pop() || 'folder'}`, 'success')
        setUndoStack((prev) => [
          { type: 'copy', items: createdFiles, destDir },
          ...prev.slice(0, 19)
        ])
      } else {
        addToast(`Copy failed: ${res.error}`, 'error')
      }
    }

    loadDirectory('left', leftPane.path)
    if (isDualPane) loadDirectory('right', rightPane.path)
  }, [clipboard, currentPaneState.path, leftPane.path, rightPane.path, isDualPane, loadDirectory, addToast])

  const handleUndo = useCallback(async () => {
    if (undoStack.length === 0) {
      addToast('Nothing to undo', 'info')
      return
    }

    const lastAction = undoStack[0]
    setUndoStack((prev) => prev.slice(1))

    if (lastAction.type === 'move') {
      const targetPaths = lastAction.items.map((i) => i.to)
      const res = await api.move(targetPaths, lastAction.destDir)
      if (res.success) {
        addToast(`Undid move: restored ${targetPaths.length} item(s)`, 'success')
      } else {
        addToast(`Undo move failed: ${res.error}`, 'error')
      }
    } else if (lastAction.type === 'copy') {
      const res = await api.trash(lastAction.items)
      if (res.success) {
        addToast(`Undid copy: removed ${lastAction.items.length} copied item(s)`, 'success')
      } else {
        addToast(`Undo copy failed: ${res.error}`, 'error')
      }
    }

    loadDirectory('left', leftPane.path)
    if (isDualPane) loadDirectory('right', rightPane.path)
  }, [undoStack, leftPane.path, rightPane.path, isDualPane, loadDirectory, addToast])

  const handleSelectAll = useCallback(() => {
    const items = currentPaneState.items
    if (!items || items.length === 0) return
    setCurPaneState((prev) => ({
      ...prev,
      selectedPaths: new Set(items.map((i) => i.path))
    }))
    addToast(`Selected all ${items.length} item(s)`, 'info')
  }, [currentPaneState.items, setCurPaneState, addToast])

  const handleDeleteToTrash = useCallback(async () => {
    const selected = Array.from(currentPaneState.selectedPaths)
    if (selected.length === 0) return
    const res = await api.trash(selected)
    if (res.success) {
      addToast(`Moved ${selected.length} item(s) to Recycle Bin / Trash`, 'success')
      loadDirectory(activePane, currentPaneState.path)
      setCurPaneState((prev) => ({ ...prev, selectedPaths: new Set() }))
      lastSelectedPathRef.current = null
    } else {
      addToast(`Trash error: ${res.error}`, 'error')
    }
  }, [currentPaneState.selectedPaths, currentPaneState.path, activePane, loadDirectory, setCurPaneState, addToast])

  const handleTriggerPermanentDelete = useCallback(() => {
    const selected = Array.from(currentPaneState.selectedPaths)
    if (selected.length === 0) return
    setPermDeleteModal({ isOpen: true, paths: selected })
  }, [currentPaneState.selectedPaths])

  const executePermanentDelete = useCallback(async () => {
    if (permDeleteModal.paths.length === 0) return
    const count = permDeleteModal.paths.length
    const res = await api.deletePermanent(permDeleteModal.paths)
    if (res.success) {
      addToast(`Permanently deleted ${count} item(s)`, 'success')
      loadDirectory(activePane, currentPaneState.path)
      setCurPaneState((prev) => ({ ...prev, selectedPaths: new Set() }))
      lastSelectedPathRef.current = null
    } else {
      addToast(`Delete error: ${res.error}`, 'error')
    }
    setPermDeleteModal({ isOpen: false, paths: [] })
  }, [permDeleteModal.paths, activePane, currentPaneState.path, loadDirectory, setCurPaneState, addToast])

  const handleItemSelect = useCallback((item, e, paneName) => {
    setActivePane(paneName)
    const setter = paneName === 'left' ? setLeftPane : setRightPane
    const currentPane = paneName === 'left' ? leftPane : rightPane
    const items = currentPane.items

    if (e.shiftKey && lastSelectedPathRef.current) {
      // Windows Shift+Click Range Selection
      const anchorIdx = items.findIndex((i) => i.path === lastSelectedPathRef.current)
      const currentIdx = items.findIndex((i) => i.path === item.path)

      if (anchorIdx !== -1 && currentIdx !== -1) {
        const start = Math.min(anchorIdx, currentIdx)
        const end = Math.max(anchorIdx, currentIdx)
        const rangePaths = new Set(items.slice(start, end + 1).map((i) => i.path))
        setter((prev) => ({ ...prev, selectedPaths: rangePaths }))
        return
      }
    }

    if (e.metaKey || e.ctrlKey) {
      // Windows Ctrl+Click Multi-Selection
      setter((prev) => {
        const next = new Set(prev.selectedPaths)
        if (next.has(item.path)) next.delete(item.path)
        else next.add(item.path)
        return { ...prev, selectedPaths: next }
      })
      lastSelectedPathRef.current = item.path
    } else {
      // Single Click Selection
      setter((prev) => ({ ...prev, selectedPaths: new Set([item.path]) }))
      lastSelectedPathRef.current = item.path
    }
  }, [leftPane, rightPane])

  // Inbuilt Photo Gallery Navigation & Controller
  const openPhotoGallery = useCallback(async (targetItem) => {
    const allImages = currentPaneState.items.filter(isImageFile)
    if (allImages.length === 0 && targetItem) {
      allImages.push(targetItem)
    }
    if (allImages.length === 0) {
      addToast('No image files found in current directory', 'info')
      return
    }

    const targetPath = targetItem ? targetItem.path : (allImages[0] ? allImages[0].path : null)
    const foundIndex = targetPath ? allImages.findIndex((img) => img.path === targetPath) : 0
    const activeIndex = foundIndex >= 0 ? foundIndex : 0
    const initialItem = allImages[activeIndex]

    setPhotoGallery({
      isOpen: true,
      items: allImages,
      currentIndex: activeIndex,
      zoom: 1,
      rotation: 0,
      isFlipped: false,
      isPlaying: false,
      previewData: null,
      loading: true
    })

    try {
      const res = await api.readPreview(initialItem.path)
      setPhotoGallery((prev) => ({
        ...prev,
        previewData: res.success ? res.previewData : null,
        loading: false
      }))
    } catch {
      setPhotoGallery((prev) => ({ ...prev, loading: false }))
    }
  }, [currentPaneState.items, addToast])

  const handleNextPhoto = useCallback(() => {
    setPhotoGallery((prev) => {
      if (prev.items.length === 0) return prev
      return {
        ...prev,
        currentIndex: (prev.currentIndex + 1) % prev.items.length,
        zoom: 1,
        rotation: 0,
        isFlipped: false
      }
    })
  }, [])

  const handlePrevPhoto = useCallback(() => {
    setPhotoGallery((prev) => {
      if (prev.items.length === 0) return prev
      return {
        ...prev,
        currentIndex: (prev.currentIndex - 1 + prev.items.length) % prev.items.length,
        zoom: 1,
        rotation: 0,
        isFlipped: false
      }
    })
  }, [])

  // Auto load preview whenever currentIndex updates in Photo Gallery
  useEffect(() => {
    if (!photoGallery.isOpen || photoGallery.items.length === 0) return
    const currentItem = photoGallery.items[photoGallery.currentIndex]
    if (!currentItem) return

    let isMounted = true
    setPhotoGallery((prev) => ({ ...prev, loading: true }))

    api.readPreview(currentItem.path).then((res) => {
      if (isMounted) {
        setPhotoGallery((prev) => ({
          ...prev,
          previewData: res.success ? res.previewData : null,
          loading: false
        }))
      }
    }).catch(() => {
      if (isMounted) {
        setPhotoGallery((prev) => ({ ...prev, loading: false }))
      }
    })

    if (filmstripRef.current && filmstripRef.current.children[photoGallery.currentIndex]) {
      filmstripRef.current.children[photoGallery.currentIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }

    return () => { isMounted = false }
  }, [photoGallery.isOpen, photoGallery.currentIndex, photoGallery.items])

  // Slideshow auto-advance timer
  useEffect(() => {
    if (!photoGallery.isOpen || !photoGallery.isPlaying || photoGallery.items.length <= 1) return
    const timer = setInterval(() => {
      setPhotoGallery((prev) => ({
        ...prev,
        currentIndex: (prev.currentIndex + 1) % prev.items.length,
        zoom: 1,
        rotation: 0
      }))
    }, 3000)
    return () => clearInterval(timer)
  }, [photoGallery.isOpen, photoGallery.isPlaying, photoGallery.items.length])

  // External Path & System Default File Manager Launch Listener
  useEffect(() => {
    if (api.getInitialPath) {
      api.getInitialPath().then((p) => {
        if (p) {
          if (isImageFile({ path: p, name: p })) {
            openPhotoGallery({ path: p, name: p.split('/').pop() })
          } else {
            navigateTo(p)
          }
        }
      })
    }

    if (api.onOpenExternalPath) {
      const unbind = api.onOpenExternalPath((externalPath) => {
        if (!externalPath) return
        if (isImageFile({ path: externalPath, name: externalPath })) {
          openPhotoGallery({ path: externalPath, name: externalPath.split('/').pop() })
        } else {
          navigateTo(externalPath)
        }
      })
      return () => unbind()
    }
  }, [navigateTo, openPhotoGallery])

  // Initial check for macOS Login Item state
  useEffect(() => {
    if (api.getLoginItemSettings) {
      api.getLoginItemSettings().then((res) => {
        if (res && res.success && res.settings) {
          setLoginItemStatus(Boolean(res.settings.openAtLogin))
        }
      })
    }
  }, [])

  const handleOpenItem = useCallback(async (item) => {
    if (!item) return
    if (item.isDirectory) {
      navigateTo(item.path)
    } else if (useInbuiltGallery && isImageFile(item)) {
      openPhotoGallery(item)
    } else {
      const res = await api.openPath(item.path)
      if (!res.success) {
        addToast(`Cannot open file: ${res.error}`, 'error')
      }
    }
  }, [navigateTo, useInbuiltGallery, openPhotoGallery, addToast])

  const startInlineRename = useCallback((item) => {
    if (!item) return
    setRenamingItemPath(item.path)
    setRenamingNewName(item.name)
    setTimeout(() => {
      if (renameInputRef.current) {
        renameInputRef.current.focus()
        const dotIdx = item.name.lastIndexOf('.')
        if (dotIdx > 0 && !item.isDirectory) {
          renameInputRef.current.setSelectionRange(0, dotIdx)
        } else {
          renameInputRef.current.select()
        }
      }
    }, 50)
  }, [])

  const submitInlineRename = useCallback(async () => {
    if (!renamingItemPath || !renamingNewName.trim()) {
      setRenamingItemPath(null)
      return
    }
    const res = await api.rename(renamingItemPath, renamingNewName.trim())
    if (res.success) {
      addToast('Item renamed', 'success')
      loadDirectory(activePane, currentPaneState.path)
    } else {
      addToast(`Rename failed: ${res.error}`, 'error')
    }
    setRenamingItemPath(null)
  }, [renamingItemPath, renamingNewName, activePane, currentPaneState.path, loadDirectory, addToast])

  const submitNewItem = useCallback(async () => {
    const { type, name } = newItemDialog
    if (!name.trim()) return

    const parent = currentPaneState.path
    const res = type === 'folder' ? await api.mkdir(parent, name.trim()) : await api.mkfile(parent, name.trim())

    if (res.success) {
      addToast(`Created ${type}: ${name.trim()}`, 'success')
      setNewItemDialog({ isOpen: false, type: 'folder', name: '' })
      loadDirectory(activePane, parent)
    } else {
      addToast(`Creation failed: ${res.error}`, 'error')
    }
  }, [newItemDialog, currentPaneState.path, activePane, loadDirectory, addToast])

  // --- FEATURE 1: SMART FOLDER REORGANIZER HANDLERS (AI POWERED) ---
  const handleOpenReorganizeModal = useCallback(async () => {
    setReorganizeModal({
      isOpen: true,
      strategy: 'ai',
      previewMoves: [],
      categoryCounts: {},
      selectedMoves: new Set(),
      categoryFilter: 'all',
      searchFilter: '',
      editingSrc: null,
      editingFolderName: '',
      loading: true
    })

    if (api.previewReorganize) {
      const res = await api.previewReorganize(currentPaneState.path, 'ai')
      if (res.success) {
        setReorganizeModal((prev) => ({
          ...prev,
          strategy: 'ai',
          previewMoves: res.moves,
          categoryCounts: res.categoryCounts,
          selectedMoves: new Set(res.moves.map((m) => m.src)),
          loading: false
        }))
      } else {
        setReorganizeModal((prev) => ({ ...prev, loading: false }))
        addToast(`Could not analyze directory: ${res.error}`, 'error')
      }
    }
  }, [currentPaneState.path, addToast])

  const handleChangeReorganizeStrategy = useCallback(async (newStrategy) => {
    setReorganizeModal((prev) => ({ ...prev, strategy: newStrategy, loading: true }))
    if (api.previewReorganize) {
      const res = await api.previewReorganize(currentPaneState.path, newStrategy)
      if (res.success) {
        setReorganizeModal((prev) => ({
          ...prev,
          strategy: newStrategy,
          previewMoves: res.moves,
          categoryCounts: res.categoryCounts,
          selectedMoves: new Set(res.moves.map((m) => m.src)),
          categoryFilter: 'all',
          loading: false
        }))
      }
    }
  }, [currentPaneState.path])

  const handleToggleSelectMove = useCallback((src) => {
    setReorganizeModal((prev) => {
      const nextSet = new Set(prev.selectedMoves)
      if (nextSet.has(src)) {
        nextSet.delete(src)
      } else {
        nextSet.add(src)
      }
      return { ...prev, selectedMoves: nextSet }
    })
  }, [])

  const handleToggleSelectAllMoves = useCallback((visibleSrcs) => {
    setReorganizeModal((prev) => {
      const allSelected = visibleSrcs.every((src) => prev.selectedMoves.has(src))
      const nextSet = new Set(prev.selectedMoves)
      if (allSelected) {
        visibleSrcs.forEach((src) => nextSet.delete(src))
      } else {
        visibleSrcs.forEach((src) => nextSet.add(src))
      }
      return { ...prev, selectedMoves: nextSet }
    })
  }, [])

  const handleUpdateMoveCategory = useCallback((src, newCategory) => {
    const trimmed = (newCategory || '').trim()
    if (!trimmed) {
      setReorganizeModal((prev) => ({ ...prev, editingSrc: null, editingFolderName: '' }))
      return
    }
    setReorganizeModal((prev) => {
      const updatedMoves = prev.previewMoves.map((m) => {
        if (m.src === src) {
          const basePath = m.destDir.substring(0, m.destDir.lastIndexOf('/'))
          const newDestDir = `${basePath}/${trimmed}`
          return {
            ...m,
            category: trimmed,
            destDir: newDestDir,
            destPath: `${newDestDir}/${m.filename}`,
            reason: 'Customized folder destination'
          }
        }
        return m
      })

      const newCounts = {}
      updatedMoves.forEach((m) => {
        newCounts[m.category] = (newCounts[m.category] || 0) + 1
      })

      return {
        ...prev,
        previewMoves: updatedMoves,
        categoryCounts: newCounts,
        editingSrc: null,
        editingFolderName: ''
      }
    })
  }, [])

  const handleExecuteReorganize = useCallback(async () => {
    const movesToExecute = reorganizeModal.previewMoves.filter((m) =>
      reorganizeModal.selectedMoves.has(m.src)
    )
    if (movesToExecute.length === 0) {
      addToast('No files selected for organization', 'warning')
      return
    }
    setReorganizeModal((prev) => ({ ...prev, loading: true }))

    if (api.executeReorganize) {
      const res = await api.executeReorganize(movesToExecute)
      if (res.success) {
        addToast(`✨ AI organized ${res.movedCount} file(s) into smart folders!`, 'success')
        setReorganizeModal({
          isOpen: false,
          strategy: 'ai',
          previewMoves: [],
          categoryCounts: {},
          selectedMoves: new Set(),
          categoryFilter: 'all',
          searchFilter: '',
          editingSrc: null,
          editingFolderName: '',
          loading: false
        })
        loadDirectory(activePane, currentPaneState.path)
      } else {
        addToast('Some files could not be reorganized', 'warning')
        setReorganizeModal((prev) => ({ ...prev, loading: false }))
      }
    }
  }, [reorganizeModal.previewMoves, reorganizeModal.selectedMoves, activePane, currentPaneState.path, loadDirectory, addToast])

  // --- FEATURE 2: STORAGE OPTIMIZER & JUNK CLEANER HANDLERS ---
  const handleOpenCleanerModal = useCallback(async () => {
    setCleanerModal({
      isOpen: true,
      scanning: true,
      cleaning: false,
      junkItems: [],
      selectedJunkPaths: new Set(),
      totalReclaimable: 0
    })

    if (api.scanCleaner) {
      const res = await api.scanCleaner(currentPaneState.path)
      if (res.success) {
        const allPaths = new Set(res.items.map((i) => i.path))
        setCleanerModal({
          isOpen: true,
          scanning: false,
          cleaning: false,
          junkItems: res.items,
          selectedJunkPaths: allPaths, // All checked by default
          totalReclaimable: res.totalReclaimable
        })
      } else {
        setCleanerModal((prev) => ({ ...prev, scanning: false }))
        addToast(`Scan error: ${res.error}`, 'error')
      }
    }
  }, [currentPaneState.path, addToast])

  const handleToggleJunkItem = useCallback((path) => {
    setCleanerModal((prev) => {
      const next = new Set(prev.selectedJunkPaths)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return { ...prev, selectedJunkPaths: next }
    })
  }, [])

  const handleToggleAllJunk = useCallback(() => {
    setCleanerModal((prev) => {
      if (prev.selectedJunkPaths.size === prev.junkItems.length) {
        return { ...prev, selectedJunkPaths: new Set() }
      } else {
        return { ...prev, selectedJunkPaths: new Set(prev.junkItems.map((i) => i.path)) }
      }
    })
  }, [])

  const handleExecuteCleanJunk = useCallback(async () => {
    const paths = Array.from(cleanerModal.selectedJunkPaths)
    if (paths.length === 0) return
    setCleanerModal((prev) => ({ ...prev, cleaning: true }))

    if (api.cleanJunk) {
      const res = await api.cleanJunk(paths)
      if (res.success) {
        addToast(`Reclaimed ${formatBytes(res.reclaimedBytes)}! Moved ${res.count} junk item(s) to Trash.`, 'success')
        setCleanerModal({ isOpen: false, scanning: false, cleaning: false, junkItems: [], selectedJunkPaths: new Set(), totalReclaimable: 0 })
        loadDirectory(activePane, currentPaneState.path)
        if (api.getDiskSpace) {
          api.getDiskSpace().then((s) => s.success && setDiskStats(s))
        }
      } else {
        addToast('Failed to clean some junk items', 'warning')
        setCleanerModal((prev) => ({ ...prev, cleaning: false }))
      }
    }
  }, [cleanerModal.selectedJunkPaths, activePane, currentPaneState.path, loadDirectory, addToast])

  // --- DISK USAGE BREAKDOWN TELEMETRY LOADER ---
  const loadDiskBreakdown = useCallback(async () => {
    try {
      setDiskBreakdownLoading(true)
      if (api?.getDiskBreakdown) {
        const res = await api.getDiskBreakdown()
        if (res && res.success) {
          setDiskBreakdown(res)
          setDiskStats({
            freeBytes: res.freeBytes,
            totalBytes: res.totalBytes,
            usedPercent: res.usedPercent
          })
        }
      }
    } catch (e) {
      console.error('Failed to load disk breakdown:', e)
    } finally {
      setDiskBreakdownLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDiskBreakdown()
  }, [loadDiskBreakdown])

  // --- DUPLICATE FILES FINDER & CLEANER HANDLERS ---
  const handleOpenDuplicateModal = useCallback(async () => {
    setDuplicateModal((prev) => ({ ...prev, isOpen: true, scanning: true, groups: [], selectedPaths: new Set() }))
    try {
      const res = await api.scanDuplicates?.(currentPaneState.path)
      if (res && res.success) {
        const autoSelected = new Set()
        for (const group of res.groups) {
          for (let i = 1; i < group.files.length; i++) {
            autoSelected.add(group.files[i].path)
          }
        }
        setDuplicateModal((prev) => ({
          ...prev,
          scanning: false,
          groups: res.groups,
          selectedPaths: autoSelected,
          totalDuplicatesCount: res.totalDuplicatesCount,
          totalReclaimableBytes: res.totalReclaimableBytes
        }))
      } else {
        setDuplicateModal((prev) => ({ ...prev, scanning: false }))
      }
    } catch (err) {
      setDuplicateModal((prev) => ({ ...prev, scanning: false }))
      addToast('Failed to scan duplicate files: ' + err.message, 'error')
    }
  }, [currentPaneState.path, addToast])

  const handleCleanDuplicates = useCallback(async () => {
    const paths = Array.from(duplicateModal.selectedPaths)
    if (paths.length === 0) return

    setDuplicateModal((prev) => ({ ...prev, cleaning: true }))
    try {
      const res = await api.cleanDuplicates?.(paths)
      if (res && res.success) {
        addToast(`Cleaned ${res.count} duplicate files and reclaimed ${formatBytes(res.reclaimedBytes)}!`, 'success')
        setDuplicateModal((prev) => ({ ...prev, isOpen: false, cleaning: false }))
        loadDirectory(activePane, currentPaneState.path)
        loadDiskBreakdown()
      } else {
        addToast('Error removing duplicates', 'error')
        setDuplicateModal((prev) => ({ ...prev, cleaning: false }))
      }
    } catch (err) {
      addToast('Duplicate cleaner error: ' + err.message, 'error')
      setDuplicateModal((prev) => ({ ...prev, cleaning: false }))
    }
  }, [duplicateModal.selectedPaths, activePane, currentPaneState.path, loadDirectory, loadDiskBreakdown, addToast])

  // --- LARGE & OLD FILES MANAGER HANDLERS ---
  const handleOpenLargeOldModal = useCallback(async () => {
    setLargeOldModal((prev) => ({ ...prev, isOpen: true, scanning: true, files: [], selectedPaths: new Set() }))
    try {
      const res = await api.scanLargeOldFiles?.(currentPaneState.path)
      if (res && res.success) {
        setLargeOldModal((prev) => ({
          ...prev,
          scanning: false,
          files: res.files,
          totalBytes: res.totalBytes
        }))
      } else {
        setLargeOldModal((prev) => ({ ...prev, scanning: false }))
      }
    } catch (err) {
      setLargeOldModal((prev) => ({ ...prev, scanning: false }))
      addToast('Failed to scan large files: ' + err.message, 'error')
    }
  }, [currentPaneState.path, addToast])

  const handleCleanLargeOldFiles = useCallback(async () => {
    const paths = Array.from(largeOldModal.selectedPaths)
    if (paths.length === 0) return

    setLargeOldModal((prev) => ({ ...prev, trashing: true }))
    try {
      const res = await api.trash?.(paths)
      if (res && res.success) {
        addToast(`Moved ${paths.length} large/old files to Trash`, 'success')
        setLargeOldModal((prev) => ({
          ...prev,
          isOpen: false,
          trashing: false,
          files: prev.files.filter((f) => !paths.includes(f.path)),
          selectedPaths: new Set()
        }))
        loadDirectory(activePane, currentPaneState.path)
        loadDiskBreakdown()
      } else {
        addToast('Error moving files to Trash', 'error')
        setLargeOldModal((prev) => ({ ...prev, trashing: false }))
      }
    } catch (err) {
      addToast('Trash error: ' + err.message, 'error')
      setLargeOldModal((prev) => ({ ...prev, trashing: false }))
    }
  }, [largeOldModal.selectedPaths, activePane, currentPaneState.path, loadDirectory, loadDiskBreakdown, addToast])

  // --- BIG FEATURE 1: APP UNINSTALLER & DEEP RESIDUAL CLEANER HANDLERS ---
  const handleSelectAppToInspect = useCallback(async (app) => {
    setUninstallerModal((prev) => ({
      ...prev,
      selectedApp: app,
      appDetailsLoading: true,
      appFootprint: null,
      selectedPathsToClean: new Set()
    }))

    if (api.scanAppLeftovers) {
      const res = await api.scanAppLeftovers(app)
      if (res.success) {
        const allPaths = new Set([
          res.appBundle.path,
          ...res.leftovers.map((l) => l.path)
        ])
        setUninstallerModal((prev) => ({
          ...prev,
          appDetailsLoading: false,
          appFootprint: res,
          selectedPathsToClean: allPaths
        }))
      } else {
        setUninstallerModal((prev) => ({ ...prev, appDetailsLoading: false }))
        addToast('Failed to scan app leftovers', 'error')
      }
    }
  }, [addToast])

  const handleOpenUninstallerModal = useCallback(async () => {
    setUninstallerModal({
      isOpen: true,
      tab: 'apps',
      loading: true,
      apps: [],
      searchQuery: '',
      selectedApp: null,
      appDetailsLoading: false,
      appFootprint: null,
      selectedPathsToClean: new Set(),
      orphanItems: [],
      orphanLoading: false,
      selectedOrphanPaths: new Set(),
      uninstalling: false
    })

    if (api.listApps) {
      const res = await api.listApps()
      if (res.success) {
        setUninstallerModal((prev) => ({
          ...prev,
          apps: res.apps,
          loading: false
        }))
        if (res.apps.length > 0) {
          handleSelectAppToInspect(res.apps[0])
        }
      } else {
        setUninstallerModal((prev) => ({ ...prev, loading: false }))
        addToast(`Could not load apps: ${res.error}`, 'error')
      }
    }
  }, [handleSelectAppToInspect, addToast])

  const handleToggleUninstallerPath = useCallback((path) => {
    setUninstallerModal((prev) => {
      const next = new Set(prev.selectedPathsToClean)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return { ...prev, selectedPathsToClean: next }
    })
  }, [])

  const handleToggleAllUninstallerPaths = useCallback(() => {
    setUninstallerModal((prev) => {
      if (!prev.appFootprint) return prev
      const allPaths = [prev.appFootprint.appBundle.path, ...prev.appFootprint.leftovers.map((l) => l.path)]
      if (prev.selectedPathsToClean.size === allPaths.length) {
        return { ...prev, selectedPathsToClean: new Set() }
      } else {
        return { ...prev, selectedPathsToClean: new Set(allPaths) }
      }
    })
  }, [])

  const handleExecuteDeepUninstall = useCallback(async () => {
    const paths = Array.from(uninstallerModal.selectedPathsToClean)
    if (paths.length === 0) return
    setUninstallerModal((prev) => ({ ...prev, uninstalling: true }))

    if (api.uninstallDeep) {
      const res = await api.uninstallDeep(paths)
      if (res.success) {
        addToast(`Successfully uninstalled app & purged ${formatBytes(res.reclaimedBytes)} of residuals!`, 'success')
        const appsRes = await api.listApps()
        setUninstallerModal((prev) => ({
          ...prev,
          apps: appsRes.success ? appsRes.apps : prev.apps,
          selectedApp: null,
          appFootprint: null,
          selectedPathsToClean: new Set(),
          uninstalling: false
        }))
        loadDirectory(activePane, currentPaneState.path)
      } else {
        addToast('Some files could not be uninstalled', 'warning')
        setUninstallerModal((prev) => ({ ...prev, uninstalling: false }))
      }
    }
  }, [uninstallerModal.selectedPathsToClean, activePane, currentPaneState.path, loadDirectory, addToast])

  const handleScanOrphanLeftovers = useCallback(async () => {
    setUninstallerModal((prev) => ({ ...prev, orphanLoading: true }))
    if (api.scanOrphanLeftovers) {
      const res = await api.scanOrphanLeftovers()
      if (res.success) {
        setUninstallerModal((prev) => ({
          ...prev,
          orphanItems: res.items,
          selectedOrphanPaths: new Set(res.items.map((i) => i.path)),
          orphanLoading: false
        }))
      } else {
        setUninstallerModal((prev) => ({ ...prev, orphanLoading: false }))
        addToast('Failed to scan orphan leftovers', 'error')
      }
    }
  }, [addToast])

  const handleExecuteCleanOrphans = useCallback(async () => {
    const paths = Array.from(uninstallerModal.selectedOrphanPaths)
    if (paths.length === 0) return
    setUninstallerModal((prev) => ({ ...prev, orphanLoading: true }))

    if (api.uninstallDeep) {
      const res = await api.uninstallDeep(paths)
      if (res.success) {
        addToast(`Purged ${res.removedCount} orphan item(s), reclaimed ${formatBytes(res.reclaimedBytes)}!`, 'success')
        handleScanOrphanLeftovers()
      } else {
        addToast('Could not purge all orphan items', 'warning')
        setUninstallerModal((prev) => ({ ...prev, orphanLoading: false }))
      }
    }
  }, [uninstallerModal.selectedOrphanPaths, handleScanOrphanLeftovers, addToast])

  // --- BIG FEATURE 2: PERFORMANCE IMPROVEMENT ENHANCER HANDLERS ---
  const handleOpenPerfModal = useCallback(async () => {
    setPerfModal((prev) => ({ ...prev, isOpen: true, loading: true }))
    if (api.getSystemPerfStats && api.listProcesses) {
      const [statsRes, procRes] = await Promise.all([
        api.getSystemPerfStats(),
        api.listProcesses()
      ])
      setPerfModal((prev) => ({
        ...prev,
        isOpen: true,
        stats: statsRes.success ? statsRes : prev.stats,
        processes: procRes.success ? procRes.processes : prev.processes,
        loading: false
      }))
    }
  }, [])

  const handleRefreshPerfStats = useCallback(async () => {
    if (api.getSystemPerfStats && api.listProcesses) {
      const [statsRes, procRes] = await Promise.all([
        api.getSystemPerfStats(),
        api.listProcesses()
      ])
      setPerfModal((prev) => ({
        ...prev,
        stats: statsRes.success ? statsRes : prev.stats,
        processes: procRes.success ? procRes.processes : prev.processes
      }))
    }
  }, [])

  const handleKillProcess = useCallback(async (pid, name) => {
    if (api.killProcess) {
      const res = await api.killProcess(pid)
      if (res.success) {
        addToast(`Terminated task: ${name} (PID ${pid})`, 'success')
        handleRefreshPerfStats()
      } else {
        addToast(`Failed to terminate ${name}: ${res.error}`, 'error')
      }
    }
  }, [handleRefreshPerfStats, addToast])

  const handleOptimizeMemory = useCallback(async () => {
    setPerfModal((prev) => ({ ...prev, optimizingMemory: true }))
    if (api.optimizeMemory) {
      const res = await api.optimizeMemory()
      addToast(res.message || 'Inactive RAM purged!', 'success')
      await handleRefreshPerfStats()
    }
    setPerfModal((prev) => ({ ...prev, optimizingMemory: false }))
  }, [handleRefreshPerfStats, addToast])

  const handleFlushDns = useCallback(async () => {
    setPerfModal((prev) => ({ ...prev, flushingDns: true }))
    if (api.flushDns) {
      const res = await api.flushDns()
      addToast(res.message || 'macOS DNS cache flushed!', 'success')
    }
    setPerfModal((prev) => ({ ...prev, flushingDns: false }))
  }, [addToast])

  const handleCleanQuicklook = useCallback(async () => {
    setPerfModal((prev) => ({ ...prev, cleaningQuicklook: true }))
    if (api.cleanQuicklookCache) {
      const res = await api.cleanQuicklookCache()
      addToast(res.message || 'QuickLook caches purged!', 'success')
    }
    setPerfModal((prev) => ({ ...prev, cleaningQuicklook: false }))
  }, [addToast])

  // Auto-refresh performance stats when Performance Enhancer modal is open
  useEffect(() => {
    if (!perfModal.isOpen || !perfModal.autoRefresh) return
    const interval = setInterval(() => {
      handleRefreshPerfStats()
    }, 2500)
    return () => clearInterval(interval)
  }, [perfModal.isOpen, perfModal.autoRefresh, handleRefreshPerfStats])

  // Batch Power Renamer Execution
  const handleBatchRenameSubmit = useCallback(async () => {
    const selected = Array.from(currentPaneState.selectedPaths)
    if (selected.length === 0) return

    const operations = []
    let counter = 1

    selected.forEach((p) => {
      const origName = p.split('/').pop()
      const dotIdx = origName.lastIndexOf('.')
      let base = dotIdx > 0 ? origName.slice(0, dotIdx) : origName
      const ext = dotIdx > 0 ? origName.slice(dotIdx) : ''

      if (batchRenameModal.findText) {
        base = base.replaceAll(batchRenameModal.findText, batchRenameModal.replaceText)
      }

      if (batchRenameModal.caseTransform === 'lower') base = base.toLowerCase()
      if (batchRenameModal.caseTransform === 'upper') base = base.toUpperCase()
      if (batchRenameModal.caseTransform === 'title') {
        base = base.replace(/\b\w/g, (c) => c.toUpperCase())
      }

      if (batchRenameModal.prefix) base = `${batchRenameModal.prefix}${base}`
      if (batchRenameModal.suffix) base = `${base}${batchRenameModal.suffix}`

      if (batchRenameModal.numbering) {
        base = `${base}_${String(counter).padStart(3, '0')}`
        counter++
      }

      const finalName = `${base}${ext}`
      operations.push({ oldPath: p, newName: finalName })
    })

    if (api.batchRename) {
      const res = await api.batchRename(operations)
      if (res.success) {
        addToast(`Batch renamed ${operations.length} file(s)`, 'success')
        setBatchRenameModal((prev) => ({ ...prev, isOpen: false }))
        loadDirectory(activePane, currentPaneState.path)
      } else {
        addToast('Some files could not be renamed', 'warning')
      }
    }
  }, [currentPaneState.selectedPaths, currentPaneState.path, batchRenameModal, activePane, loadDirectory, addToast])

  // Terminal Runner
  const runTerminalCommand = useCallback(async (e) => {
    e.preventDefault()
    if (!terminalInputVal.trim()) return

    const cmd = terminalInputVal.trim()
    setTerminalInputVal('')
    setTerminalHistory((prev) => [...prev, { type: 'input', text: `$ ${cmd}` }])

    if (cmd === 'clear') {
      setTerminalHistory([])
      return
    }

    if (api.runCommand) {
      const res = await api.runCommand(cmd, currentPaneState.path)
      if (res.stdout) {
        setTerminalHistory((prev) => [...prev, { type: 'stdout', text: res.stdout.trim() }])
      }
      if (res.stderr) {
        setTerminalHistory((prev) => [...prev, { type: 'stderr', text: res.stderr.trim() }])
      }
    }
  }, [terminalInputVal, currentPaneState.path])

  const handleOpenTerminal = useCallback(async () => {
    const res = await api.openTerminal(currentPaneState.path)
    if (res.success) addToast('Opened in Terminal', 'success')
    else addToast(`Terminal error: ${res.error}`, 'error')
  }, [currentPaneState.path, addToast])

  const handleOpenVSCode = useCallback(async () => {
    const res = await api.openVSCode(currentPaneState.path)
    if (res.success) addToast('Opened in VS Code', 'success')
    else addToast(`VS Code error: ${res.error}`, 'error')
  }, [currentPaneState.path, addToast])

  const handleTransferToOtherPane = useCallback(async (action = 'move') => {
    const sourceItems = Array.from(currentPaneState.selectedPaths)
    if (sourceItems.length === 0) {
      addToast('No items selected to transfer', 'warning')
      return
    }
    const targetDir = activePane === 'left' ? rightPane.path : leftPane.path
    if (!targetDir) {
      addToast('Target pane has no directory open', 'warning')
      return
    }

    const res = action === 'move' ? await api.move(sourceItems, targetDir) : await api.copy(sourceItems, targetDir)
    if (res.success) {
      addToast(`${action === 'move' ? 'Moved' : 'Copied'} ${sourceItems.length} item(s) to opposite pane`, 'success')
    } else {
      addToast(`Transfer error: ${res.error}`, 'error')
    }
    loadDirectory('left', leftPane.path)
    loadDirectory('right', rightPane.path)
  }, [currentPaneState.selectedPaths, activePane, rightPane.path, leftPane.path, loadDirectory, addToast])

  const handleAddToShelf = useCallback(() => {
    const selected = Array.from(currentPaneState.selectedPaths)
    if (selected.length === 0) return
    const newItems = selected.filter((p) => !shelfItems.includes(p))
    setShelfItems((prev) => [...prev, ...newItems])
    setShelfOpen(true)
    addToast(`Added ${newItems.length} item(s) to Drop Shelf`, 'info')
  }, [currentPaneState.selectedPaths, shelfItems, addToast])

  const handleShelfTransfer = useCallback(async (action = 'copy') => {
    if (shelfItems.length === 0) return
    const destDir = currentPaneState.path
    const res = action === 'move' ? await api.move(shelfItems, destDir) : await api.copy(shelfItems, destDir)
    if (res.success) {
      addToast(`${action === 'move' ? 'Moved' : 'Copied'} all shelf items here`, 'success')
      if (action === 'move') setShelfItems([])
    } else {
      addToast(`Shelf transfer failed: ${res.error}`, 'error')
    }
    loadDirectory(activePane, destDir)
  }, [shelfItems, currentPaneState.path, activePane, loadDirectory, addToast])

  // 1. IPC Shortcut Listener (from Electron native menu & before-input-event)
  useEffect(() => {
    if (!api.onShortcut) return
    const cleanup = api.onShortcut((action) => {
      const activeEl = document.activeElement
      const isInputActive = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')
      if (isInputActive && ['copy', 'cut', 'paste', 'select-all', 'undo'].includes(action)) {
        return
      }

      if (action === 'copy') handleCopy()
      else if (action === 'cut') handleCut()
      else if (action === 'paste') handlePaste()
      else if (action === 'select-all') handleSelectAll()
      else if (action === 'undo') handleUndo()
      else if (action === 'delete') handleDeleteToTrash()
      else if (action === 'delete-permanent') handleTriggerPermanentDelete()
      else if (action === 'rename') {
        const selected = Array.from(currentPaneState.selectedPaths)
        if (selected.length === 1) {
          const item = currentPaneState.items.find((i) => i.path === selected[0])
          if (item) startInlineRename(item)
        }
      } else if (action === 'refresh') {
        refreshCurrent()
      } else if (action === 'new-folder') {
        setNewItemDialog({ isOpen: true, type: 'folder', name: 'New Folder' })
        setTimeout(() => newItemInputRef.current?.select(), 50)
      } else if (action === 'new-file') {
        setNewItemDialog({ isOpen: true, type: 'file', name: 'untitled.txt' })
        setTimeout(() => newItemInputRef.current?.select(), 50)
      } else if (action === 'new-tab') {
        handleNewTab()
      } else if (action === 'close-tab') {
        handleCloseTab(activeTabId)
      } else if (action === 'view-details') {
        updateViewMode('details')
      } else if (action === 'view-grid') {
        updateViewMode('grid')
      } else if (action === 'toggle-dual') {
        setIsDualPane((p) => !p)
      } else if (action === 'enter-fullscreen') {
        setIsWindowFullScreen(true)
      } else if (action === 'leave-fullscreen') {
        setIsWindowFullScreen(false)
      }
    })
    return cleanup
  }, [
    handleCopy, handleCut, handlePaste, handleSelectAll, handleUndo, handleDeleteToTrash,
    handleTriggerPermanentDelete, currentPaneState, startInlineRename, refreshCurrent,
    handleNewTab, handleCloseTab, activeTabId, setCurPaneState
  ])

  // 2. Global Keyboard Shortcuts (Windows Explorer standard + Mac support)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F11 or Cmd+Ctrl+F for Fullscreen toggle
      if (e.key === 'F11') {
        e.preventDefault()
        handleToggleFullscreen()
        return
      }

      const activeEl = document.activeElement
      const isInputActive = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')

      // If user is editing text in an input/textarea, preserve native typing and text edit shortcuts
      if (isInputActive) {
        if (e.key === 'Escape') {
          activeEl.blur()
          setIsEditingAddress(false)
          setRenamingItemPath(null)
          setQuickLookItem(null)
        }
        return
      }

      // Inbuilt Photo Gallery keyboard navigation
      if (photoGallery.isOpen) {
        if (e.key === 'Escape') {
          e.preventDefault()
          setPhotoGallery((prev) => ({ ...prev, isOpen: false, isPlaying: false }))
          return
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key.toLowerCase() === 'n') {
          e.preventDefault()
          handleNextPhoto()
          return
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp' || e.key.toLowerCase() === 'p') {
          e.preventDefault()
          handlePrevPhoto()
          return
        }
        if (e.key === ' ') {
          e.preventDefault()
          setPhotoGallery((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
          return
        }
        if (e.key === '+' || e.key === '=') {
          e.preventDefault()
          setPhotoGallery((prev) => ({ ...prev, zoom: Math.min(5, Number((prev.zoom * 1.25).toFixed(2))) }))
          return
        }
        if (e.key === '-' || e.key === '_') {
          e.preventDefault()
          setPhotoGallery((prev) => ({ ...prev, zoom: Math.max(0.25, Number((prev.zoom / 1.25).toFixed(2))) }))
          return
        }
        if (e.key === '0') {
          e.preventDefault()
          setPhotoGallery((prev) => ({ ...prev, zoom: 1 }))
          return
        }
        if (e.key.toLowerCase() === 'r') {
          e.preventDefault()
          setPhotoGallery((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))
          return
        }
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault()
          setPhotoGallery((prev) => ({ ...prev, isFlipped: !prev.isFlipped }))
          return
        }
        if (e.key.toLowerCase() === 'o') {
          e.preventDefault()
          const currentItem = photoGallery.items[photoGallery.currentIndex]
          if (currentItem) api.openPath(currentItem.path)
          return
        }
        return
      }

      // Close QuickLook on Escape or Space
      if (quickLookItem && (e.key === 'Escape' || e.key === ' ')) {
        e.preventDefault()
        setQuickLookItem(null)
        return
      }

      // Cancel Cut or clear selection on Escape
      if (e.key === 'Escape') {
        if (clipboard.operation === 'cut') {
          e.preventDefault()
          setClipboard({ operation: null, items: [], sourceDir: '', sourcePane: 'left' })
          addToast('Cut operation cancelled', 'info')
          return
        }
        if (currentPaneState.selectedPaths.size > 0) {
          e.preventDefault()
          setCurPaneState((prev) => ({ ...prev, selectedPaths: new Set() }))
          lastSelectedPathRef.current = null
          return
        }
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      const key = (e.key || '').toLowerCase()
      const code = e.code || ''

      // 1. SELECT ALL (Ctrl+A / Cmd+A) - Standard Windows Explorer
      if (isCtrlOrCmd && (key === 'a' || code === 'KeyA')) {
        e.preventDefault()
        handleSelectAll()
        return
      }

      // 2. UNDO (Ctrl+Z / Cmd+Z) - Standard Windows Explorer
      if (isCtrlOrCmd && (key === 'z' || code === 'KeyZ')) {
        e.preventDefault()
        handleUndo()
        return
      }

      // 3. COPY (Ctrl+C / Cmd+C) - Standard Windows Explorer
      if (isCtrlOrCmd && (key === 'c' || code === 'KeyC')) {
        e.preventDefault()
        handleCopy()
        return
      }

      // 4. CUT (Ctrl+X / Cmd+X) - Standard Windows Explorer
      if (isCtrlOrCmd && (key === 'x' || code === 'KeyX')) {
        e.preventDefault()
        handleCut()
        return
      }

      // 5. PASTE (Ctrl+V / Cmd+V) - Standard Windows Explorer
      if (isCtrlOrCmd && (key === 'v' || code === 'KeyV')) {
        e.preventDefault()
        handlePaste()
        return
      }

      // 6. PERMANENT DELETE (Shift+Delete) - Standard Windows Explorer
      if (e.shiftKey && (e.key === 'Delete' || code === 'Delete')) {
        e.preventDefault()
        handleTriggerPermanentDelete()
        return
      }

      // 7. DELETE TO TRASH (Delete, Ctrl+D, or Cmd+Backspace) - Standard Windows Explorer
      if (e.key === 'Delete' || code === 'Delete' || (isCtrlOrCmd && (key === 'd' || code === 'KeyD')) || (isCtrlOrCmd && e.key === 'Backspace')) {
        e.preventDefault()
        handleDeleteToTrash()
        return
      }

      // 8. RENAME (F2) - Standard Windows Explorer
      if (e.key === 'F2') {
        e.preventDefault()
        const selected = Array.from(currentPaneState.selectedPaths)
        if (selected.length === 1) {
          const item = currentPaneState.items.find((i) => i.path === selected[0])
          if (item) startInlineRename(item)
        }
        return
      }

      // 9. OPEN (Enter) - Standard Windows Explorer
      if (e.key === 'Enter') {
        e.preventDefault()
        const selected = Array.from(currentPaneState.selectedPaths)
        if (selected.length === 1) {
          const item = currentPaneState.items.find((i) => i.path === selected[0])
          if (item) handleOpenItem(item)
        }
        return
      }

      // 10. GO UP TO PARENT FOLDER (Backspace or Alt+Up) - Standard Windows Explorer
      if (e.key === 'Backspace' || (e.altKey && e.key === 'ArrowUp')) {
        e.preventDefault()
        goUpOneLevel()
        return
      }

      // 11. NAVIGATION (Alt+Left / Alt+Right) - Standard Windows Explorer
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
        return
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        goForward()
        return
      }

      // 12. NEW FOLDER (Ctrl+Shift+N / Cmd+Shift+N) - Standard Windows Explorer
      if (isCtrlOrCmd && e.shiftKey && (key === 'n' || code === 'KeyN')) {
        e.preventDefault()
        setNewItemDialog({ isOpen: true, type: 'folder', name: 'New Folder' })
        setTimeout(() => newItemInputRef.current?.select(), 50)
        return
      }

      // 13. NEW FILE (Ctrl+N / Cmd+N) - Standard Windows Explorer
      if (isCtrlOrCmd && !e.shiftKey && (key === 'n' || code === 'KeyN')) {
        e.preventDefault()
        setNewItemDialog({ isOpen: true, type: 'file', name: 'untitled.txt' })
        setTimeout(() => newItemInputRef.current?.select(), 50)
        return
      }

      // 14. REFRESH (F5 or Ctrl+R) - Standard Windows Explorer
      if (e.key === 'F5' || (isCtrlOrCmd && (key === 'r' || code === 'KeyR'))) {
        e.preventDefault()
        refreshCurrent()
        return
      }

      // 15. ADDRESS BAR (Ctrl+L or Alt+D) - Standard Windows Explorer
      if ((isCtrlOrCmd && (key === 'l' || code === 'KeyL')) || (e.altKey && (key === 'd' || code === 'KeyD'))) {
        e.preventDefault()
        setIsEditingAddress(true)
        setAddressInputVal(currentPaneState.path)
        setTimeout(() => addressInputRef.current?.select(), 50)
        return
      }

      // 16. SEARCH / FILTER (Ctrl+F or F3) - Standard Windows Explorer
      if ((isCtrlOrCmd && (key === 'f' || code === 'KeyF')) || e.key === 'F3') {
        e.preventDefault()
        const searchInput = document.getElementById(`filter-input-${activePane}`)
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
        return
      }

      // 17. QUICK LOOK & INBUILT PHOTO GALLERY PREVIEW (Space)
      if (e.key === ' ') {
        e.preventDefault()
        const selected = Array.from(currentPaneState.selectedPaths)
        if (selected.length === 1) {
          const item = currentPaneState.items.find((i) => i.path === selected[0])
          if (item) {
            if (useInbuiltGallery && isImageFile(item)) {
              openPhotoGallery(item)
            } else {
              setQuickLookItem(item)
            }
          }
        }
        return
      }

      // 18. TABS & VIEWS (Ctrl+T, Ctrl+W, Ctrl+\, Ctrl+1, Ctrl+2)
      if (isCtrlOrCmd && (key === 't' || code === 'KeyT')) {
        e.preventDefault()
        handleNewTab()
        return
      }
      if (isCtrlOrCmd && (key === 'w' || code === 'KeyW')) {
        e.preventDefault()
        handleCloseTab(activeTabId)
        return
      }
      if (isCtrlOrCmd && e.key === '\\') {
        e.preventDefault()
        setIsDualPane((prev) => !prev)
        return
      }
      if (isCtrlOrCmd && (key === ',' || code === 'Comma')) {
        e.preventDefault()
        setShowDefaultManagerModal(true)
        return
      }
      if (isCtrlOrCmd && e.key === '1') {
        e.preventDefault()
        updateViewMode('details')
        return
      }
      if (isCtrlOrCmd && e.key === '2') {
        e.preventDefault()
        updateViewMode('grid')
        return
      }

      // 19. COMMAND PALETTE (Ctrl+K)
      if (isCtrlOrCmd && (key === 'k' || code === 'KeyK')) {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
        setCommandQuery('')
        setCommandSelectedIndex(0)
        return
      }

      // 20. TERMINAL DRAWER (Ctrl+`)
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        setTerminalDrawerOpen((prev) => !prev)
        setTimeout(() => terminalInputRef.current?.focus(), 100)
        return
      }

      // 21. INSPECTOR (Ctrl+I)
      if (isCtrlOrCmd && (key === 'i' || code === 'KeyI')) {
        e.preventDefault()
        setShowInspector((prev) => !prev)
        return
      }

      // 22. SHORTCUTS MODAL (F1 or Ctrl+/)
      if (((isCtrlOrCmd && (e.key === '/' || e.key === '?')) || e.key === 'F1')) {
        e.preventDefault()
        setShowShortcutsModal((prev) => !prev)
        return
      }

      // 23. ARROW NAVIGATION & RANGE EXTENSION (ArrowUp / ArrowDown, Shift+ArrowUp / Shift+ArrowDown)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const items = sortedAndFilteredItems
        if (items.length === 0) return

        const currentSelected = Array.from(currentPaneState.selectedPaths)
        let curIdx = -1
        if (lastSelectedPathRef.current) {
          curIdx = items.findIndex((i) => i.path === lastSelectedPathRef.current)
        }
        if (curIdx === -1 && currentSelected.length > 0) {
          curIdx = items.findIndex((i) => i.path === currentSelected[currentSelected.length - 1])
        }

        let newIdx = 0
        if (curIdx !== -1) {
          newIdx = e.key === 'ArrowDown' ? Math.min(items.length - 1, curIdx + 1) : Math.max(0, curIdx - 1)
        }

        const targetItem = items[newIdx]
        lastSelectedPathRef.current = targetItem.path

        if (e.shiftKey) {
          setCurPaneState((prev) => {
            const next = new Set(prev.selectedPaths)
            next.add(targetItem.path)
            return { ...prev, selectedPaths: next }
          })
        } else {
          setCurPaneState((prev) => ({
            ...prev,
            selectedPaths: new Set([targetItem.path])
          }))
        }

        const itemEl = document.getElementById(`item-${targetItem.path}`)
        if (itemEl) itemEl.scrollIntoView({ block: 'nearest' })
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [
    activeTabId, activePane, currentPaneState, sortedAndFilteredItems, quickLookItem, clipboard,
    handleNewTab, handleCloseTab, goBack, goForward, goUpOneLevel, refreshCurrent,
    handleCut, handleCopy, handlePaste, handleSelectAll, handleUndo, handleDeleteToTrash,
    handleTriggerPermanentDelete, handleOpenItem, startInlineRename, setCurPaneState, addToast,
    photoGallery, handleNextPhoto, handlePrevPhoto, openPhotoGallery, useInbuiltGallery
  ])

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) setContextMenu((prev) => ({ ...prev, visible: false }))
      if (systemMenuOpen) setSystemMenuOpen(false)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [contextMenu.visible, systemMenuOpen])

  const handleContextMenu = (e, item = null, pane = activePane) => {
    e.preventDefault()
    e.stopPropagation()
    setActivePane(pane)

    if (item && !currentPaneState.selectedPaths.has(item.path)) {
      setCurPaneState((prev) => ({ ...prev, selectedPaths: new Set([item.path]) }))
    }

    const menuWidth = 240
    const menuHeight = 420
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10)
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10)

    setContextMenu({ visible: true, x, y, item, pane })
  }

  // Command Palette Items
  const commands = useMemo(() => {
    const list = [
      { id: 'app-uninstaller', label: 'App Uninstaller & Deep Cleaner (Eradicate Leftover Residuals)', icon: PackageX, action: handleOpenUninstallerModal },
      { id: 'performance-enhancer', label: 'Performance Enhancer & Live Task Manager (Purge RAM & Flush DNS)', icon: Zap, action: handleOpenPerfModal },
      { id: 'reorganize-folder', label: 'AI Smart Folder Reorganizer (Auto-Cluster & Categorize Files)', icon: Sparkles, action: handleOpenReorganizeModal },
      { id: 'clean-storage', label: 'Clean Temp & Junk Files (Reclaim Space)', icon: Trash2, action: handleOpenCleanerModal },
      { id: 'jump-home', label: 'Jump to Home', icon: Home, action: () => api.getHome().then(navigateTo) },
      { id: 'jump-desktop', label: 'Jump to Desktop', icon: HardDrive, action: () => api.getHome().then((h) => navigateTo(`${h}/Desktop`)) },
      { id: 'jump-documents', label: 'Jump to Documents', icon: Folder, action: () => api.getHome().then((h) => navigateTo(`${h}/Documents`)) },
      { id: 'jump-downloads', label: 'Jump to Downloads', icon: Download, action: () => api.getHome().then((h) => navigateTo(`${h}/Downloads`)) },
      { id: 'new-folder', label: 'New Folder', shortcut: 'Cmd+Shift+N', icon: FolderPlus, action: () => { setNewItemDialog({ isOpen: true, type: 'folder', name: 'New Folder' }); setTimeout(() => newItemInputRef.current?.select(), 50) } },
      { id: 'new-file', label: 'New File', shortcut: 'Cmd+N', icon: FilePlus, action: () => { setNewItemDialog({ isOpen: true, type: 'file', name: 'untitled.txt' }); setTimeout(() => newItemInputRef.current?.select(), 50) } },
      { id: 'batch-rename', label: 'Power Batch Renamer', shortcut: 'Cmd+Shift+R', icon: SlidersHorizontal, action: () => setBatchRenameModal((prev) => ({ ...prev, isOpen: true })) },
      { id: 'toggle-terminal', label: 'Toggle Embedded Terminal Drawer', shortcut: 'Ctrl+`', icon: TerminalSquare, action: () => setTerminalDrawerOpen((prev) => !prev) },
      { id: 'toggle-dual', label: 'Toggle Dual-Pane Split View', shortcut: 'Cmd+\\', icon: Columns, action: () => setIsDualPane((prev) => !prev) },
      { id: 'settings', label: 'Preferences & Settings', shortcut: 'Cmd+,', icon: Settings, action: () => setShowDefaultManagerModal(true) },
      { id: 'toggle-theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, action: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) },
      { id: 'toggle-hidden', label: 'Toggle Hidden macOS Dotfiles', shortcut: 'Cmd+Shift+.', icon: Eye, action: toggleShowHidden },
      { id: 'open-term', label: 'Open in macOS Terminal', icon: Terminal, action: handleOpenTerminal },
      { id: 'open-code', label: 'Open in VS Code', icon: Code2, action: handleOpenVSCode },
      { id: 'copy-path', label: 'Copy Current Directory Path', icon: Copy, action: () => copyPathToClipboard() },
      { id: 'view-details', label: 'Switch to Details Table View', shortcut: 'Cmd+1', icon: List, action: () => updateViewMode('details') },
      { id: 'view-grid', label: 'Switch to Grid Card View', shortcut: 'Cmd+2', icon: LayoutGrid, action: () => updateViewMode('grid') },
      { id: 'toggle-inspector', label: 'Toggle Inspector Preview Pane', shortcut: 'Cmd+I', icon: Sparkles, action: () => setShowInspector((prev) => !prev) }
    ]
    if (!commandQuery.trim()) return list
    const q = commandQuery.toLowerCase()
    return list.filter((c) => c.label.toLowerCase().includes(q))
  }, [theme, commandQuery, navigateTo, toggleShowHidden, updateViewMode, handleOpenTerminal, handleOpenVSCode, copyPathToClipboard, handleOpenReorganizeModal, handleOpenCleanerModal, handleOpenUninstallerModal, handleOpenPerfModal])

  // Render Explorer Pane
  const renderExplorerPane = (paneName) => {
    const isThisPaneActive = activePane === paneName
    const pane = paneName === 'left' ? leftPane : rightPane
    const items = sortedAndFilteredItems

    if (pane.path === 'my-computer') {
      return (
        <div
          className="flex-1 flex flex-col h-full overflow-hidden mac-glass-panel"
          onClick={() => setActivePane(paneName)}
        >
          {/* Omnibar for This Mac */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-white/[0.08] mac-glass-header select-none">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => goBack(paneName)}
                disabled={pane.historyIndex <= 0}
                className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/5 active:scale-95 transition-all"
                title="Back (Alt+Left)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goForward(paneName)}
                disabled={pane.historyIndex >= pane.history.length - 1}
                className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/5 active:scale-95 transition-all"
                title="Forward (Alt+Right)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 flex items-center h-8 rounded-lg border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 text-xs">
              <HardDrive className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mr-2" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">This Mac</span>
              <span className="text-slate-400 dark:text-slate-500 mx-2">/</span>
              <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">System Storage & Volumes</span>
            </div>
          </div>

          <MyComputerScreen
            volumes={volumes}
            diskStats={diskStats}
            diskBreakdown={diskBreakdown}
            onNavigate={(p) => navigateTo(p, paneName)}
            onOpenCleaner={handleOpenCleanerModal}
            onOpenUninstaller={handleOpenUninstallerModal}
            onOpenPerf={handleOpenPerfModal}
            homePath={volumes.find((v) => v.type === 'home')?.path || '/Users'}
          />
        </div>
      )
    }

    return (
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-150 ${
          isDualPane && isThisPaneActive
            ? 'ring-1 ring-indigo-500/50 shadow-inner'
            : isDualPane
            ? 'opacity-85'
            : ''
        }`}
        onClick={() => setActivePane(paneName)}
        onContextMenu={(e) => handleContextMenu(e, null, paneName)}
      >
        {/* Omnibar */}
        <div className="flex flex-col border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#121722]">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => goBack(paneName)}
                disabled={pane.historyIndex <= 0}
                className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/5 active:scale-95 transition-all"
                title="Back (Alt+Left)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goForward(paneName)}
                disabled={pane.historyIndex >= pane.history.length - 1}
                className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/5 active:scale-95 transition-all"
                title="Forward (Alt+Right)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goUpOneLevel(paneName)}
                disabled={pane.path === '/' || !pane.path}
                className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/5 active:scale-95 transition-all"
                title="Up One Level (Backspace / Alt+Up)"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => loadDirectory(paneName, pane.path)}
                className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 active:scale-95 transition-all"
                title="Refresh (F5)"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Address bar */}
            <div className="flex-1 relative flex items-center h-8 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0b0d14] px-2.5 overflow-hidden text-xs">
              {isEditingAddress && isThisPaneActive ? (
                <form
                  className="w-full flex items-center"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setIsEditingAddress(false)
                    if (addressInputVal.trim()) navigateTo(addressInputVal.trim(), paneName)
                  }}
                >
                  <input
                    ref={addressInputRef}
                    type="text"
                    value={addressInputVal}
                    onChange={(e) => setAddressInputVal(e.target.value)}
                    onBlur={() => setIsEditingAddress(false)}
                    className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 font-mono text-xs"
                    placeholder="/Users/username..."
                  />
                </form>
              ) : (
                <div
                  className="flex items-center gap-1 w-full cursor-text overflow-x-auto no-scrollbar"
                  onClick={() => {
                    setIsEditingAddress(true)
                    setAddressInputVal(pane.path)
                    setTimeout(() => addressInputRef.current?.select(), 50)
                  }}
                >
                  {breadcrumbSegments.map((seg, idx) => (
                    <React.Fragment key={seg.path}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigateTo(seg.path, paneName)
                        }}
                        className="px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors whitespace-nowrap font-medium"
                      >
                        {seg.name}
                      </button>
                      {idx < breadcrumbSegments.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Pin Folder to Favorites */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(pane.path)
                }}
                className={`p-1 rounded transition-colors ml-auto flex-shrink-0 ${
                  favorites.some((f) => f.path === pane.path)
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Pin this folder to Favorites"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>

              {/* Copy Path Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyPathToClipboard(pane.path)
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ml-1 flex-shrink-0"
                title="Copy Full Path"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Filter Input with RegExp Toggle */}
            <div className="relative flex items-center gap-1.5">
              <div className="relative w-44 flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
                <input
                  id={`filter-input-${paneName}`}
                  type="text"
                  value={pane.filterQuery}
                  onChange={(e) => {
                    const val = e.target.value
                    const setter = paneName === 'left' ? setLeftPane : setRightPane
                    setter((prev) => ({ ...prev, filterQuery: val }))
                  }}
                  placeholder={isRegExpMode ? "RegExp... (e.g. .*View)" : "Filter... (Cmd+F)"}
                  className="w-full h-8 pl-7 pr-6 rounded-lg text-xs bg-white dark:bg-[#0b0d14] border border-slate-300 dark:border-white/10 outline-none focus:border-indigo-500 dark:focus:border-cyan-400 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {pane.filterQuery && (
                  <button
                    onClick={() => {
                      const setter = paneName === 'left' ? setLeftPane : setRightPane
                      setter((prev) => ({ ...prev, filterQuery: '' }))
                    }}
                    className="absolute right-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setIsRegExpMode((prev) => !prev)
                  addToast(!isRegExpMode ? 'RegExp Filter Mode Active (.*)' : 'Plain Search Mode Active', 'info')
                }}
                className={`h-8 px-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                  isRegExpMode
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-400/50 shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-slate-300 dark:border-white/10'
                }`}
                title="Toggle RegExp Filter Mode (Shift+Cmd+F)"
              >
                .*
              </button>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-black/30 text-[11px] overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-white/5">
            {['all', 'folders', 'code', 'images', 'docs', 'media', 'archives'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const setter = paneName === 'left' ? setLeftPane : setRightPane
                  setter((prev) => ({ ...prev, categoryFilter: cat }))
                }}
                className={`px-2 py-0.5 rounded-full capitalize font-semibold transition-all ${
                  pane.categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}

            {pane.tagFilter && (
              <button
                onClick={() => {
                  const setter = paneName === 'left' ? setLeftPane : setRightPane
                  setter((prev) => ({ ...prev, tagFilter: null }))
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 hover:bg-rose-500/30 text-[10px] font-medium"
              >
                Tag: {pane.tagFilter} <X className="w-2.5 h-2.5" />
              </button>
            )}

            {gitInfo.isGit && (
              <div className="ml-auto flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-300 bg-slate-200/60 dark:bg-white/5 px-2 py-0.5 rounded-full border border-slate-300 dark:border-flow-borderDark/40">
                <GitBranch className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{gitInfo.branch}</span>
                {gitInfo.modifiedCount > 0 && (
                  <span className="text-amber-500 font-bold">+{gitInfo.modifiedCount}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dual-Pane Inter-Pane Action Strip */}
        {isDualPane && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-flow-borderDark/30 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              {paneName === 'left' ? 'Pane 1 (Left)' : 'Pane 2 (Right)'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTransferToOtherPane('copy')}
                className="hover:text-indigo-600 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
                title="Copy selected to opposite pane"
              >
                <Copy className="w-3 h-3" /> Copy Here →
              </button>
              <button
                onClick={() => handleTransferToOtherPane('move')}
                className="hover:text-amber-600 dark:hover:text-amber-300 font-medium transition-colors flex items-center gap-1"
                title="Move selected to opposite pane"
              >
                <ArrowRight className="w-3 h-3" /> Move Here →
              </button>
            </div>
          </div>
        )}

        {/* File List Views */}
        <div
          className="flex-1 overflow-y-auto p-2 focus:outline-none"
          tabIndex={0}
          onClick={() => {
            setActivePane(paneName)
            const setter = paneName === 'left' ? setLeftPane : setRightPane
            setter((prev) => ({ ...prev, selectedPaths: new Set() }))
            lastSelectedPathRef.current = null
          }}
          onContextMenu={(e) => handleContextMenu(e, null, paneName)}
        >
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <Folder className="w-12 h-12 text-slate-400 dark:text-slate-600 stroke-[1.2]" />
              <p className="text-sm font-medium">This folder is empty</p>
              {pane.filterQuery && (
                <p className="text-xs text-slate-500">No items match "{pane.filterQuery}"</p>
              )}
            </div>
          ) : pane.viewMode === 'details' ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse select-none" style={{ tableLayout: 'fixed', minWidth: '100%' }}>
                <colgroup>
                  <col style={{ width: `${columnWidths.name}px` }} />
                  <col style={{ width: `${columnWidths.mtime}px` }} />
                  <col style={{ width: `${columnWidths.extension}px` }} />
                  <col style={{ width: `${columnWidths.size}px` }} />
                  <col style={{ width: `${columnWidths.permissions || 85}px` }} />
                  <col style={{ width: `${columnWidths.owner || 90}px` }} />
                </colgroup>
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-[#10141e]/80">
                    <th
                      className="py-1.5 px-3 relative group/th cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none"
                      onClick={() => handleSortChange(paneName, 'name')}
                    >
                      <div className="flex items-center gap-1 overflow-hidden pr-3">
                        <span className="truncate">Name</span>
                        {pane.sortField === 'name' && <span className="text-indigo-600 dark:text-indigo-400 font-bold">{pane.sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </div>
                      <div
                        onMouseDown={(e) => startColResize('name', e)}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setColumnWidths((prev) => ({ ...prev, name: 320 }))
                        }}
                        className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center hover:opacity-100 z-10 select-none group/handle"
                        title="Drag to resize column width (Double-click to reset)"
                      >
                        <div className="w-[1.5px] h-3.5 bg-slate-300 dark:bg-slate-600/80 group-hover/th:bg-indigo-500 group-hover/handle:bg-indigo-500 group-hover/handle:w-[2px] transition-all" />
                      </div>
                    </th>
                    <th
                      className="py-1.5 px-3 relative group/th cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none"
                      onClick={() => handleSortChange(paneName, 'mtime')}
                    >
                      <div className="flex items-center gap-1 overflow-hidden pr-3">
                        <span className="truncate">Date Modified</span>
                        {pane.sortField === 'mtime' && <span className="text-indigo-600 dark:text-indigo-400 font-bold">{pane.sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </div>
                      <div
                        onMouseDown={(e) => startColResize('mtime', e)}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setColumnWidths((prev) => ({ ...prev, mtime: 170 }))
                        }}
                        className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center hover:opacity-100 z-10 select-none group/handle"
                        title="Drag to resize column width (Double-click to reset)"
                      >
                        <div className="w-[1.5px] h-3.5 bg-slate-300 dark:bg-slate-600/80 group-hover/th:bg-indigo-500 group-hover/handle:bg-indigo-500 group-hover/handle:w-[2px] transition-all" />
                      </div>
                    </th>
                    <th
                      className="py-1.5 px-3 relative group/th cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none"
                      onClick={() => handleSortChange(paneName, 'extension')}
                    >
                      <div className="flex items-center gap-1 overflow-hidden pr-3">
                        <span className="truncate">Type</span>
                        {pane.sortField === 'extension' && <span className="text-indigo-600 dark:text-indigo-400 font-bold">{pane.sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </div>
                      <div
                        onMouseDown={(e) => startColResize('extension', e)}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setColumnWidths((prev) => ({ ...prev, extension: 120 }))
                        }}
                        className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center hover:opacity-100 z-10 select-none group/handle"
                        title="Drag to resize column width (Double-click to reset)"
                      >
                        <div className="w-[1.5px] h-3.5 bg-slate-300 dark:bg-slate-600/80 group-hover/th:bg-indigo-500 group-hover/handle:bg-indigo-500 group-hover/handle:w-[2px] transition-all" />
                      </div>
                    </th>
                    <th
                      className="py-1.5 px-3 text-right relative group/th cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none"
                      onClick={() => handleSortChange(paneName, 'size')}
                    >
                      <div className="flex items-center justify-end gap-1 overflow-hidden pr-3">
                        <span className="truncate">Size</span>
                        {pane.sortField === 'size' && <span className="text-indigo-600 dark:text-indigo-400 font-bold">{pane.sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </div>
                      <div
                        onMouseDown={(e) => startColResize('size', e)}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setColumnWidths((prev) => ({ ...prev, size: 100 }))
                        }}
                        className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center hover:opacity-100 z-10 select-none group/handle"
                        title="Drag to resize column width (Double-click to reset)"
                      >
                        <div className="w-[1.5px] h-3.5 bg-slate-300 dark:bg-slate-600/80 group-hover/th:bg-indigo-500 group-hover/handle:bg-indigo-500 group-hover/handle:w-[2px] transition-all" />
                      </div>
                    </th>
                    <th
                      className="py-1.5 px-3 relative group/th cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none"
                    >
                      <div className="flex items-center gap-1 overflow-hidden pr-3">
                        <span className="truncate">Chmod</span>
                      </div>
                      <div
                        onMouseDown={(e) => startColResize('permissions', e)}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setColumnWidths((prev) => ({ ...prev, permissions: 85 }))
                        }}
                        className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center hover:opacity-100 z-10 select-none group/handle"
                        title="Drag to resize column width"
                      >
                        <div className="w-[1.5px] h-3.5 bg-slate-300 dark:bg-slate-600/80 group-hover/th:bg-indigo-500 group-hover/handle:bg-indigo-500 group-hover/handle:w-[2px] transition-all" />
                      </div>
                    </th>
                    <th
                      className="py-1.5 px-3 relative group/th cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none"
                    >
                      <div className="flex items-center gap-1 overflow-hidden pr-3">
                        <span className="truncate">Owner</span>
                      </div>
                      <div
                        onMouseDown={(e) => startColResize('owner', e)}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setColumnWidths((prev) => ({ ...prev, owner: 90 }))
                        }}
                        className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center hover:opacity-100 z-10 select-none group/handle"
                        title="Drag to resize column width"
                      >
                        <div className="w-[1.5px] h-3.5 bg-slate-300 dark:bg-slate-600/80 group-hover/th:bg-indigo-500 group-hover/handle:bg-indigo-500 group-hover/handle:w-[2px] transition-all" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {items.map((item) => {
                    const isSelected = pane.selectedPaths.has(item.path)
                    const isCut = clipboard.operation === 'cut' && clipboard.items.includes(item.path)
                    const isRenaming = renamingItemPath === item.path
                    const tagColor = fileTags[item.path]

                    return (
                      <tr
                        id={`item-${item.path}`}
                        key={item.path}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleItemSelect(item, e, paneName)
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          handleOpenItem(item)
                        }}
                        onContextMenu={(e) => handleContextMenu(e, item, paneName)}
                        className={`group transition-colors cursor-default rounded-md ${
                          isSelected
                            ? 'bg-indigo-100 dark:bg-indigo-600/30 text-indigo-950 dark:text-white font-medium'
                            : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-900 dark:text-slate-100'
                        } ${isCut ? 'opacity-40 border-dashed border-indigo-400' : ''}`}
                      >
                        <td className="py-1.5 px-3 truncate overflow-hidden">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileThumbnail item={item} mode="details" />
                            {tagColor && (
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COLOR_TAGS.find((c) => c.name === tagColor)?.hex || tagColor }}
                              />
                            )}
                            {isRenaming ? (
                              <input
                                ref={renameInputRef}
                                type="text"
                                value={renamingNewName}
                                onChange={(e) => setRenamingNewName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') submitInlineRename()
                                  if (e.key === 'Escape') setRenamingItemPath(null)
                                }}
                                onBlur={submitInlineRename}
                                className="bg-white dark:bg-flow-dark border border-indigo-500 rounded px-1 py-0.5 outline-none text-slate-900 dark:text-white text-xs w-full"
                              />
                            ) : (
                              <span className="truncate font-medium text-slate-900 dark:text-slate-100">{item.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px] truncate overflow-hidden">
                          {formatDate(item.mtime)}
                        </td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] truncate overflow-hidden">
                          {item.isDirectory ? 'File folder' : (item.extension ? `${item.extension.toUpperCase().replace('.', '')} File` : 'File')}
                        </td>
                        <td className="py-1.5 px-3 text-right text-slate-600 dark:text-slate-300 font-mono text-[11px] truncate overflow-hidden">
                          {item.isDirectory ? '-' : formatBytes(item.size)}
                        </td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px] truncate overflow-hidden">
                          {item.permissions || (item.isDirectory ? '0755' : '0644')}
                        </td>
                        <td className="py-1.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] truncate overflow-hidden">
                          {item.owner || 'user:staff'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {items.map((item) => {
                const isSelected = pane.selectedPaths.has(item.path)
                const isCut = clipboard.operation === 'cut' && clipboard.items.includes(item.path)
                const isRenaming = renamingItemPath === item.path
                const tagColor = fileTags[item.path]

                return (
                  <div
                    id={`item-${item.path}`}
                    key={item.path}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleItemSelect(item, e, paneName)
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      handleOpenItem(item)
                    }}
                    onContextMenu={(e) => handleContextMenu(e, item, paneName)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-default group relative ${
                      isSelected
                        ? 'bg-indigo-100 dark:bg-indigo-600/25 border-indigo-400 dark:border-indigo-500/60 shadow-sm'
                        : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
                    } ${isCut ? 'opacity-40 border-dashed border-indigo-400' : ''}`}
                  >
                    {tagColor && (
                      <span
                        className="absolute top-2 right-2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: COLOR_TAGS.find((c) => c.name === tagColor)?.hex || tagColor }}
                      />
                    )}
                    <div className="w-full mb-2">
                      <FileThumbnail item={item} mode="grid" />
                    </div>
                    {isRenaming ? (
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={renamingNewName}
                        onChange={(e) => setRenamingNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submitInlineRename()
                          if (e.key === 'Escape') setRenamingItemPath(null)
                        }}
                        onBlur={submitInlineRename}
                        className="bg-white dark:bg-flow-dark border border-indigo-500 rounded px-1 py-0.5 outline-none text-slate-900 dark:text-white text-xs w-full text-center"
                      />
                    ) : (
                      <span className="text-xs text-slate-900 dark:text-slate-100 line-clamp-2 break-all font-medium">
                        {item.name}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      {item.isDirectory ? 'Folder' : formatBytes(item.size)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pane Status Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f131d] text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          <div>
            {items.length} items {pane.selectedPaths.size > 0 && `(${pane.selectedPaths.size} selected)`}
          </div>
          <div className="flex items-center gap-3">
            {pane.selectedPaths.size === 1 && (
              <span>
                {(() => {
                  const sel = items.find((i) => i.path === Array.from(pane.selectedPaths)[0])
                  return sel ? (sel.isDirectory ? 'Directory' : formatBytes(sel.size)) : ''
                })()}
              </span>
            )}
            {pane.selectedPaths.size > 1 && (
              <span>
                Total: {formatBytes(
                  Array.from(pane.selectedPaths).reduce((acc, p) => {
                    const found = items.find((i) => i.path === p)
                    return acc + (found?.size || 0)
                  }, 0)
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen w-screen flex flex-col font-sans overflow-hidden relative select-none ${theme === 'dark' ? 'dark text-slate-100 mac-vibrancy-dark' : 'text-slate-900 mac-vibrancy-light'}`}>
      
      {/* 1. TOP APP BAR & MULTI-TABS (macOS Native Glass Window Header) */}
      <div
        onDoubleClick={handleToggleFullscreen}
        title="Double-click header to toggle Fullscreen Mode"
        className="h-11 flex items-center justify-between pl-20 pr-3 border-b border-slate-200 dark:border-white/[0.08] mac-glass-header mac-specular select-none z-10 mac-drag-region cursor-default"
      >
        
        {/* Product Brand Squircle Button */}
        <button
          onClick={() => setShowAboutModal(true)}
          className="mac-no-drag flex items-center gap-2 px-2.5 py-1 mr-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/10 group flex-shrink-0 cursor-pointer"
          title="About FlowExplorer (v1.0.0)"
        >
          <img src={flowLogo} alt="FlowExplorer" className="w-5 h-5 rounded-md shadow-sm group-hover:scale-105 transition-transform object-cover" />
          <span className="text-xs font-bold tracking-tight bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 dark:from-cyan-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent">
            FlowExplorer
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
            PRO
          </span>
        </button>

        <div
          onDoubleClick={(e) => {
            if (e.target === e.currentTarget) handleToggleFullscreen()
          }}
          className="mac-no-drag flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 mr-4"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId
            return (
              <div
                key={tab.id}
                onClick={() => handleSwitchTab(tab)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all max-w-[190px] border ${
                  isActive
                    ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white border-slate-300 dark:border-white/[0.18] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.06] border-transparent font-medium'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="truncate">{tab.name}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="p-0.5 rounded-md hover:bg-slate-300/60 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )
          })}
          <button
            onClick={handleNewTab}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors"
            title="New Tab (Cmd+T)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mac-no-drag flex items-center gap-1.5">
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors"
            title="Keyboard Shortcuts Cheat Sheet (⌘/ or F1)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setTerminalDrawerOpen((prev) => !prev)}
            className={`p-1.5 rounded-lg transition-colors ${terminalDrawerOpen ? 'bg-indigo-600/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'}`}
            title="Toggle Embedded Terminal Drawer (Ctrl+`)"
          >
            <TerminalSquare className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={handleToggleFullscreen}
            className={`p-1.5 rounded-lg transition-colors ${
              isWindowFullScreen
                ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
            }`}
            title={`Toggle Fullscreen Mode (Double-click titlebar or F11) ${isWindowFullScreen ? '(Exit Fullscreen)' : '(Enter Fullscreen)'}`}
          >
            {isWindowFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowDefaultManagerModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 transition-all font-semibold"
            title="Settings & System Preferences (Cmd+,)"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-all"
          >
            <Search className="w-3 h-3" />
            <span>Command Palette</span>
            <kbd className="px-1 py-0.2 rounded bg-slate-200 dark:bg-white/10 text-[10px] font-mono">⌘K</kbd>
          </button>

          <button
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* 2. POWER-USER ACTION RIBBON */}
      <div
        onDoubleClick={(e) => {
          if (e.target === e.currentTarget) handleToggleFullscreen()
        }}
        className="h-10 flex items-center justify-between px-3 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0f131d] text-xs z-10 select-none cursor-default"
      >
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 mr-2">
          
          {/* GROUP 1: Creation Hub */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => {
                setNewItemDialog({ isOpen: true, type: 'folder', name: 'New Folder' })
                setTimeout(() => newItemInputRef.current?.select(), 50)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors font-semibold"
              title="New Folder (Ctrl+Shift+N / ⌘Shift+N)"
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="hidden sm:inline">New Folder</span>
            </button>

            <button
              onClick={() => {
                setNewItemDialog({ isOpen: true, type: 'file', name: 'untitled.txt' })
                setTimeout(() => newItemInputRef.current?.select(), 50)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors font-semibold"
              title="New File (Ctrl+N / ⌘N)"
            >
              <FilePlus className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
              <span className="hidden sm:inline">New File</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/10 mx-1 flex-shrink-0" />

          {/* GROUP 2: Windows 11 Action Ribbon (Cut, Copy, Paste, Rename, Delete, Undo) */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleCut}
              disabled={currentPaneState.selectedPaths.size === 0}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium"
              title="Cut selected items (Ctrl+X / ⌘X)"
            >
              <Scissors className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden xl:inline">Cut</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={currentPaneState.selectedPaths.size === 0}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium"
              title="Copy selected items (Ctrl+C / ⌘C)"
            >
              <Copy className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden xl:inline">Copy</span>
            </button>

            <button
              onClick={handlePaste}
              disabled={!clipboard.items || clipboard.items.length === 0}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors font-medium ${
                clipboard.items && clipboard.items.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
              title={`Paste items into current folder (Ctrl+V / ⌘V)${clipboard.items?.length ? ` - ${clipboard.items.length} item(s) staged` : ''}`}
            >
              <ClipboardPaste className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden xl:inline">Paste</span>
              {clipboard.items && clipboard.items.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                  {clipboard.items.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                const selected = Array.from(currentPaneState.selectedPaths)
                if (selected.length === 1) {
                  const item = currentPaneState.items.find((i) => i.path === selected[0])
                  if (item) startInlineRename(item)
                }
              }}
              disabled={currentPaneState.selectedPaths.size !== 1}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium"
              title="Rename selected item (F2)"
            >
              <Edit3 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden xl:inline">Rename</span>
            </button>

            <button
              onClick={handleDeleteToTrash}
              disabled={currentPaneState.selectedPaths.size === 0}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 hover:bg-rose-500/10 transition-colors font-medium"
              title="Move to Trash / Recycle Bin (Delete / ⌘⌫)"
            >
              <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden xl:inline">Delete</span>
            </button>

            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium"
              title={`Undo last file action (Ctrl+Z / ⌘Z)${undoStack.length ? ` - ${undoStack.length} action(s) available` : ''}`}
            >
              <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden 2xl:inline">Undo</span>
              {undoStack.length > 0 && (
                <span className="px-1 py-0.2 rounded-full bg-slate-300 dark:bg-white/20 text-[9px] font-bold">
                  {undoStack.length}
                </span>
              )}
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/10 mx-1 flex-shrink-0" />

          {/* GROUP 3: Media & Batch Tools Hub */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const selected = Array.from(currentPaneState.selectedPaths)
                let itemToOpen = null
                if (selected.length === 1) {
                  const found = currentPaneState.items.find((i) => i.path === selected[0])
                  if (found && isImageFile(found)) itemToOpen = found
                }
                openPhotoGallery(itemToOpen)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all font-semibold"
              title="Inbuilt Photo Gallery (Browse all photos with Next / Prev, Zoom, Slideshow)"
            >
              <Images className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="hidden sm:inline">Photo Gallery</span>
              {currentPaneState.items.filter(isImageFile).length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                  {currentPaneState.items.filter(isImageFile).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setBatchRenameModal((prev) => ({ ...prev, isOpen: true }))}
              disabled={currentPaneState.selectedPaths.size === 0}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium"
              title="Batch Power Renamer (Cmd+Shift+R)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
              <span className="hidden lg:inline">Batch Rename</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/10 mx-1 flex-shrink-0" />

          {/* GROUP 4: AI & System Intelligence Hub */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleOpenReorganizeModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-indigo-700 dark:text-indigo-200 hover:text-indigo-900 dark:hover:text-white hover:from-indigo-500/30 hover:to-purple-500/30 transition-all font-semibold border border-indigo-400/40 shadow-sm"
              title="AI Smart Reorganize: Automatically group files into intelligent semantic folders"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse flex-shrink-0" />
              <span className="hidden sm:inline">AI Organize</span>
            </button>

            {/* Responsive System & Storage Tools Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSystemMenuOpen((prev) => !prev)
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                  systemMenuOpen
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/25'
                }`}
                title="System & Storage Tools: Clean Junk, App Uninstaller, Performance Enhancer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                <span className="hidden sm:inline">System Tools</span>
                <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${systemMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {systemMenuOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-64 rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0f131d]/95 backdrop-blur-xl shadow-2xl p-1.5 text-xs text-slate-800 dark:text-slate-200 flex flex-col gap-0.5 z-50 select-none animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Storage & Maintenance
                  </div>

                  <button
                    onClick={() => {
                      handleOpenCleanerModal()
                      setSystemMenuOpen(false)
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Clean Temp Junk</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Purge .DS_Store, build logs & caches</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenUninstallerModal()
                      setSystemMenuOpen(false)
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-300 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400">
                      <PackageX className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">App Uninstaller</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Deep remove apps & residual plists</div>
                    </div>
                  </button>

                  <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />

                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    macOS System Health
                  </div>

                  <button
                    onClick={() => {
                      handleOpenPerfModal()
                      setSystemMenuOpen(false)
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">Performance Boost</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Purge inactive RAM & flush DNS cache</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/10 mx-1 flex-shrink-0" />

          {/* GROUP 5: Developer Quick-Launch Hub */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleOpenTerminal}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium"
              title="Open current folder in macOS Terminal"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <span className="hidden lg:inline">Terminal</span>
            </button>
            <button
              onClick={handleOpenVSCode}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium"
              title="Open current folder in Visual Studio Code"
            >
              <Code2 className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 flex-shrink-0" />
              <span className="hidden lg:inline">VS Code</span>
            </button>
          </div>
        </div>

        {/* GROUP 6: View Modes & Layout Controls (Right Side) */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex items-center bg-slate-200/60 dark:bg-white/5 rounded-lg p-0.5 border border-slate-300 dark:border-white/10">
            <button
              onClick={() => updateViewMode('details')}
              className={`p-1.5 rounded-md transition-colors ${
                currentPaneState.viewMode === 'details'
                  ? 'bg-white dark:bg-white/15 text-indigo-700 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Details Table View (Cmd+1)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                currentPaneState.viewMode === 'grid'
                  ? 'bg-white dark:bg-white/15 text-indigo-700 dark:text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid Card View (Cmd+2)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/10 mx-0.5" />

          <button
            onClick={() => setIsDualPane((prev) => !prev)}
            className={`p-1.5 rounded-md transition-colors border ${
              isDualPane
                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold border-indigo-200 dark:border-indigo-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 border-transparent'
            }`}
            title="Toggle Dual-Pane Split View (Cmd+\)"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowInspector((prev) => !prev)}
            className={`p-1.5 rounded-md transition-colors border ${
              showInspector
                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold border-indigo-200 dark:border-indigo-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 border-transparent'
            }`}
            title="Toggle Inspector Preview Pane (Cmd+I or Space)"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Native macOS Finder Design */}
        <div
          style={{ width: `${sidebarWidth}px` }}
          className="flex flex-col border-r border-slate-200 dark:border-white/[0.08] mac-glass-sidebar text-[13px] py-2 px-2 select-none flex-shrink-0 overflow-y-auto no-scrollbar font-normal text-slate-800 dark:text-slate-200"
        >
          {/* SECTION 1: FAVORITES / USER FOLDERS */}
          <div className="space-y-0.5">
            {/* Standard Favorites */}
            {sidebarData.favorites.map((fav) => {
              const isActive = currentPaneState.path === fav.path
              return (
                <button
                  key={fav.path}
                  onClick={() => navigateTo(fav.path)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all group ${
                    isActive
                      ? 'bg-slate-300/80 dark:bg-white/15 text-slate-950 dark:text-white font-medium shadow-xs'
                      : 'hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {/* Accurate macOS Finder Folder Icons */}
                  {fav.type === 'desktop' && (
                    <Monitor className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  )}
                  {fav.type === 'documents' && (
                    <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  )}
                  {fav.type === 'downloads' && (
                    <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                      <ArrowDown className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                  )}
                  {fav.type === 'movies' && (
                    <Film className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  )}
                  {fav.type === 'music' && (
                    <Music className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  )}
                  {fav.type === 'pictures' && (
                    <Image className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  )}
                  {fav.type === 'custom' && (
                    <Folder className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  )}

                  <span className="truncate">{fav.name}</span>

                  {/* iCloud cloud outline icon on right (Desktop & Documents) */}
                  {fav.hasCloud && (
                    <Cloud className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 ml-auto flex-shrink-0 stroke-[1.5]" />
                  )}
                </button>
              )
            })}

            {/* Custom User Pinned Favorites */}
            {favorites.map((userFav) => {
              if (sidebarData.favorites.some((f) => f.path === userFav.path)) return null
              const isActive = currentPaneState.path === userFav.path
              return (
                <div
                  key={userFav.path}
                  onClick={() => navigateTo(userFav.path)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-slate-300/80 dark:bg-white/15 text-slate-950 dark:text-white font-medium shadow-xs'
                      : 'hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate">{userFav.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(userFav.path)
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 transition-opacity"
                    title="Remove from sidebar"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </div>

          {/* SECTION 2: LOCATIONS */}
          <div className="space-y-0.5 mt-3">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-tight px-2.5 py-1 select-none">
              Locations
            </div>

            {/* Cloud Storage (iCloud Drive, O+Connect, Google Drive, etc.) */}
            {sidebarData.cloudLocations.map((cloud) => {
              const isActive = currentPaneState.path === cloud.path
              return (
                <button
                  key={cloud.path}
                  onClick={() => navigateTo(cloud.path)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all group ${
                    isActive
                      ? 'bg-slate-300/80 dark:bg-white/15 text-slate-950 dark:text-white font-medium shadow-xs'
                      : 'hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {cloud.type === 'icloud' && (
                    <Cloud className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  )}
                  {cloud.type === 'googledrive' && (
                    <Triangle className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  )}
                  {['cloudfolder', 'onedrive', 'dropbox'].includes(cloud.type) && (
                    <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  )}

                  <span className="truncate">{cloud.name}</span>

                  {cloud.type === 'icloud' && (
                    <div
                      className="ml-auto w-3 h-3 rounded-full border border-slate-400 dark:border-slate-500 border-r-transparent animate-spin flex-shrink-0 opacity-70"
                      title="iCloud Drive Syncing"
                    />
                  )}
                </button>
              )
            })}

            {/* Device Locations (User Home, MacBook Air, Primary Disk) */}
            {sidebarData.deviceLocations.map((dev) => {
              const isActive = currentPaneState.path === dev.path
              return (
                <button
                  key={dev.name + dev.path}
                  onClick={() => navigateTo(dev.path)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all group ${
                    isActive
                      ? 'bg-slate-300/80 dark:bg-white/15 text-slate-950 dark:text-white font-medium shadow-xs'
                      : 'hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {dev.type === 'home' && (
                    <Home className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  )}
                  {dev.type === 'computer' && (
                    <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  )}
                  {dev.type === 'root' && (
                    <HardDrive className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  )}

                  <span className="truncate">{dev.name}</span>
                </button>
              )
            })}

            {/* Mounted Removable / DMG / Game Volumes in /Volumes */}
            {sidebarData.removableVolumes.map((vol) => {
              const isActive = currentPaneState.path === vol.path
              return (
                <div
                  key={vol.path}
                  onClick={() => navigateTo(vol.path)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-slate-300/80 dark:bg-white/15 text-slate-950 dark:text-white font-medium shadow-xs'
                      : 'hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 mr-1">
                    <Disc className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <span className="truncate">{vol.name}</span>
                  </div>
                  <button
                    onClick={(e) => handleEjectVolume(vol, e)}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-0.5 rounded transition-all opacity-60 group-hover:opacity-100"
                    title={`Eject "${vol.name}"`}
                  >
                    <Eject className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}

            {/* AirDrop */}
            <button
              onClick={() => addToast('AirDrop transfers are handled natively in macOS Finder', 'info')}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200"
            >
              <Radio className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <span>AirDrop</span>
            </button>

            {/* Bin / Trash */}
            <button
              onClick={() => navigateTo(sidebarData.trash.path || `${api.getHome ? '~' : ''}/.Trash`)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all group ${
                currentPaneState.path === sidebarData.trash.path
                  ? 'bg-slate-300/80 dark:bg-white/15 text-slate-950 dark:text-white font-medium shadow-xs'
                  : 'hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Trash2 className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <span>Bin</span>
            </button>
          </div>

          {/* SECTION 3: TAGS (Single line layout) */}
          <div className="mt-3 mb-2 px-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-tight py-1 select-none">
              <span>Tags</span>
              {currentPaneState.tagFilter && (
                <button
                  onClick={() => setCurPaneState((prev) => ({ ...prev, tagFilter: null }))}
                  className="text-[10px] text-blue-500 hover:underline font-normal"
                >
                  Clear ({currentPaneState.tagFilter})
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 py-1.5 px-2 bg-slate-200/50 dark:bg-white/5 rounded-lg border border-slate-300/40 dark:border-white/5">
              {COLOR_TAGS.map((t) => {
                const isTagActive = currentPaneState.tagFilter === t.name
                return (
                  <button
                    key={t.name}
                    title={t.label}
                    onClick={() => {
                      setCurPaneState((prev) => ({
                        ...prev,
                        tagFilter: prev.tagFilter === t.name ? null : t.name
                      }))
                    }}
                    className={`relative p-1 rounded-full transition-all hover:scale-125 focus:outline-hidden ${
                      isTagActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-900 scale-110' : ''
                    }`}
                  >
                    <span
                      className="block w-3 h-3 rounded-full shadow-xs"
                      style={{ backgroundColor: t.hex }}
                    />
                  </button>
                )
              })}
              <div className="h-3 w-px bg-slate-300 dark:bg-white/10 mx-0.5" />
              {/* All Tags / Clear Filter */}
              <button
                title="All Tags / Clear filter"
                onClick={() => {
                  setCurPaneState((prev) => ({
                    ...prev,
                    tagFilter: null
                  }))
                  addToast('Showing all tags', 'info')
                }}
                className={`p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-300/40 dark:hover:bg-white/10 transition-colors ${
                  !currentPaneState.tagFilter ? 'text-blue-500' : ''
                }`}
              >
                <Tags className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collapsible Storage Health / Cleaner Widget Footer */}
          <div className="mt-auto pt-2 border-t border-slate-200/80 dark:border-white/5">
            <DiskUsageWidget
              breakdown={diskBreakdown}
              loading={diskBreakdownLoading}
              onOpenJunk={handleOpenCleanerModal}
              onOpenDuplicates={handleOpenDuplicateModal}
              onOpenApps={handleOpenUninstallerModal}
              onOpenLargeOld={handleOpenLargeOldModal}
            />
          </div>
        </div>

        {/* Sidebar Drag Resizer Divider */}
        <div
          onMouseDown={startSidebarResize}
          className="w-1.5 cursor-col-resize hover:bg-indigo-500/80 active:bg-indigo-500 transition-colors z-20 flex-shrink-0 relative group select-none flex items-center justify-center"
          title="Drag to resize sidebar width"
        >
          <div className="w-[1px] h-8 bg-slate-700/60 group-hover:bg-indigo-400 rounded-full" />
        </div>

        {/* Center Panes */}
        <div className="flex-1 flex overflow-hidden">
          <div style={{ flex: isDualPane ? `0 0 ${splitRatio}%` : '1 1 auto', overflow: 'hidden', display: 'flex' }}>
            {renderExplorerPane('left')}
          </div>
          {isDualPane && (
            <>
              {/* Dual-Pane Resizer Divider */}
              <div
                onMouseDown={startSplitResize}
                className="w-1.5 cursor-col-resize hover:bg-indigo-500/80 active:bg-indigo-500 bg-flow-borderDark/60 transition-colors flex-shrink-0 relative z-20 select-none flex items-center justify-center"
                title="Drag to resize split panes"
              >
                <div className="w-[1px] h-8 bg-slate-700/60 hover:bg-indigo-400 rounded-full" />
              </div>
              <div style={{ flex: `0 0 ${100 - splitRatio}%`, overflow: 'hidden', display: 'flex' }}>
                {renderExplorerPane('right')}
              </div>
            </>
          )}
        </div>

        {/* Right Live File Inspector Pane */}
        {showInspector && (
          <>
            {/* Inspector Drag Resizer Divider */}
            <div
              onMouseDown={startInspectorResize}
              className="w-1.5 cursor-col-resize hover:bg-indigo-500/80 active:bg-indigo-500 transition-colors z-20 flex-shrink-0 relative group select-none flex items-center justify-center"
              title="Drag to resize inspector width"
            >
              <div className="w-[1px] h-8 bg-slate-700/60 group-hover:bg-indigo-400 rounded-full" />
            </div>

            <div
              style={{ width: `${inspectorWidth}px` }}
              className="flex flex-col border-l border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f131d] p-4 text-xs overflow-y-auto flex-shrink-0"
            >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Inspector
              </span>
              <button onClick={() => setShowInspector(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedItemForPreview ? (
              <div className="flex flex-col gap-4">
                <div className="w-full h-44 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090a10] flex items-center justify-center overflow-hidden p-2 relative group shadow-sm">
                  {previewLoading ? (
                    <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                  ) : previewData?.type === 'image' ? (
                    <img
                      src={previewData.previewData}
                      alt={selectedItemForPreview.name}
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  ) : previewData?.type === 'audio' ? (
                    <div className="flex flex-col items-center gap-2 p-2 w-full">
                      <Music className="w-10 h-10 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                      <audio controls src={previewData.previewData} className="w-full h-8" />
                    </div>
                  ) : previewData?.type === 'video' ? (
                    <div className="flex flex-col items-center gap-2 p-2">
                      <Video className="w-12 h-12 text-pink-500 dark:text-pink-400" />
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">Video Media File</span>
                    </div>
                  ) : previewData?.type === 'text' ? (
                    <div className="w-full h-full overflow-hidden text-[10px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#0b0d14] p-2 select-text whitespace-pre-wrap">
                      {previewData.previewData}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <FileThumbnail item={selectedItemForPreview} mode="grid" />
                    </div>
                  )}

                  <button
                    onClick={() => setQuickLookItem(selectedItemForPreview)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Quick Look (Space)"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-bold text-sm text-slate-900 dark:text-white break-all">
                    {selectedItemForPreview.name}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>{selectedItemForPreview.isDirectory ? 'Directory' : formatBytes(selectedItemForPreview.size)}</span>
                    <span className="font-mono">{selectedItemForPreview.permissions || '0755'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200 dark:border-white/10">
                  <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold">Assign Color Tag</span>
                  <div className="flex items-center gap-1.5">
                    {COLOR_TAGS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setItemTag(selectedItemForPreview.path, c.name)}
                        className={`w-4 h-4 rounded-full transition-transform hover:scale-125 ${
                          fileTags[selectedItemForPreview.path] === c.name ? 'ring-2 ring-indigo-500 scale-110' : ''
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200 dark:border-white/10 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Modified:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono text-[10px]">{formatDate(selectedItemForPreview.mtime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Created:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono text-[10px]">{formatDate(selectedItemForPreview.birthtime)}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-slate-600 dark:text-slate-400 text-[10px]">Full Path:</span>
                    <div
                      onClick={() => copyPathToClipboard(selectedItemForPreview.path)}
                      className="text-[10px] font-mono bg-white dark:bg-[#121620] p-1.5 rounded border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 cursor-pointer break-all"
                      title="Click to copy path"
                    >
                      {selectedItemForPreview.path}
                    </div>
                  </div>
                </div>

                {!selectedItemForPreview.isDirectory && (
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                        <Hash className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Checksum
                      </span>
                      {!hashResult.sha256 && (
                        <button
                          onClick={computeFileHash}
                          disabled={hashResult.loading}
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          {hashResult.loading ? 'Calculating...' : 'Compute Hash'}
                        </button>
                      )}
                    </div>
                    {hashResult.sha256 && (
                      <div className="flex flex-col gap-1">
                        <div
                          onClick={() => copyPathToClipboard(hashResult.sha256)}
                          className="text-[9px] font-mono bg-white dark:bg-[#0b0d14] p-1.5 rounded border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 break-all cursor-pointer hover:text-indigo-600 dark:hover:text-sky-400"
                          title="Click to copy SHA-256"
                        >
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">SHA256: </span>
                          {hashResult.sha256}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1.5 pt-2">
                  <button
                    onClick={() => handleOpenItem(selectedItemForPreview)}
                    className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    Open in Default App
                  </button>
                  <button
                    onClick={() => api.openVSCode(selectedItemForPreview.path)}
                    className="w-full py-1.5 rounded-lg bg-slate-200/80 dark:bg-white/5 hover:bg-slate-300/80 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-medium text-xs transition-colors"
                  >
                    Open in VS Code
                  </button>
                  <button
                    onClick={handleAddToShelf}
                    className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-medium text-xs transition-colors"
                  >
                    + Add to Drop Shelf
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 text-center">
                <Sparkles className="w-8 h-8 text-slate-400 dark:text-slate-600 stroke-[1.2]" />
                <p>Select a file to inspect its preview, metadata, tags, and checksums</p>
              </div>
            )}
          </div>
        </>
      )}
      </div>

      {/* 4. IN-APP TERMINAL DRAWER (Ctrl + `) */}
      {terminalDrawerOpen && (
        <div className="h-48 border-t border-flow-borderDark bg-flow-dark/95 backdrop-blur-xl flex flex-col text-xs z-30 font-mono">
          <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-flow-borderDark/40">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <TerminalSquare className="w-3.5 h-3.5 text-indigo-400" />
              Embedded Terminal Drawer — <span className="text-slate-300">{currentPaneState.path}</span>
            </span>
            <button onClick={() => setTerminalDrawerOpen(false)} className="text-slate-500 hover:text-slate-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1 text-[11px]">
            {terminalHistory.map((item, idx) => (
              <div
                key={idx}
                className={
                  item.type === 'input'
                    ? 'text-sky-400 font-bold'
                    : item.type === 'stderr'
                    ? 'text-rose-400'
                    : item.type === 'system'
                    ? 'text-slate-500 italic'
                    : 'text-slate-300 whitespace-pre-wrap'
                }
              >
                {item.text}
              </div>
            ))}
          </div>

          <form onSubmit={runTerminalCommand} className="flex items-center border-t border-flow-borderDark/50 px-3 py-1.5 bg-black/30">
            <span className="text-emerald-400 mr-2 font-bold">$</span>
            <input
              ref={terminalInputRef}
              type="text"
              value={terminalInputVal}
              onChange={(e) => setTerminalInputVal(e.target.value)}
              placeholder="Run command (e.g. git status, ls -la, npm test)..."
              className="w-full bg-transparent outline-none text-slate-200 placeholder:text-slate-600 text-xs"
            />
          </form>
        </div>
      )}

      {/* 5. FLOATING DROP SHELF */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {shelfOpen && (
          <div className="mb-2 w-72 rounded-xl border border-flow-borderDark bg-flow-panel shadow-2xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-flow-borderDark/40">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Drop Shelf ({shelfItems.length})
              </span>
              <button onClick={() => setShelfOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
              {shelfItems.length === 0 ? (
                <div className="text-[11px] text-slate-500 py-3 text-center">Shelf is empty</div>
              ) : (
                shelfItems.map((p) => (
                  <div key={p} className="flex items-center justify-between px-2 py-1 rounded bg-white/5 text-[11px]">
                    <span className="truncate flex-1 text-slate-300 mr-2">{p.split('/').pop()}</span>
                    <button
                      onClick={() => setShelfItems((prev) => prev.filter((item) => item !== p))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {shelfItems.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1 border-t border-flow-borderDark/40 text-xs">
                <button
                  onClick={() => handleShelfTransfer('copy')}
                  className="flex-1 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px]"
                >
                  Copy All Here
                </button>
                <button
                  onClick={() => handleShelfTransfer('move')}
                  className="flex-1 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px]"
                >
                  Move All Here
                </button>
                <button
                  onClick={() => setShelfItems([])}
                  className="p-1 rounded text-slate-400 hover:text-rose-400"
                  title="Clear Shelf"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setShelfOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-flow-borderDark bg-flow-panel shadow-lg hover:bg-flow-panelHover text-xs font-medium text-slate-200 transition-all hover:scale-105"
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Drop Shelf</span>
          {shelfItems.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">
              {shelfItems.length}
            </span>
          )}
        </button>
      </div>

      {/* 6. QUICK LOOK FULL OVERLAY MODAL */}
      {quickLookItem && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in"
          onClick={() => setQuickLookItem(null)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <FileThumbnail item={quickLookItem} mode="details" />
                <span className="font-bold text-base text-slate-900 dark:text-white">{quickLookItem.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">({formatBytes(quickLookItem.size)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleFullscreen}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  title={`Toggle Fullscreen Mode (Double Click) ${isWindowFullScreen ? '(Exit Fullscreen)' : '(Enter Fullscreen)'}`}
                >
                  {isWindowFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setQuickLookItem(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              onDoubleClick={handleToggleFullscreen}
              className="flex-1 overflow-y-auto flex items-center justify-center bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl p-4 min-h-[300px] cursor-default"
            >
              {previewData?.type === 'image' ? (
                <img src={previewData.previewData} alt={quickLookItem.name} className="max-h-[60vh] object-contain rounded-lg shadow-lg" />
              ) : previewData?.type === 'audio' ? (
                <audio controls src={previewData.previewData} className="w-full max-w-md" />
              ) : previewData?.type === 'text' ? (
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 w-full h-full whitespace-pre-wrap select-text">
                  {previewData.previewData}
                </pre>
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-500">
                  <div className="w-48">
                    <FileThumbnail item={quickLookItem} mode="grid" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">{quickLookItem.name}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Path: {quickLookItem.path}</span>
              <button
                onClick={() => {
                  handleOpenItem(quickLookItem)
                  setQuickLookItem(null)
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-colors"
              >
                Open in Default App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. NEW FEATURE: AI SMART FOLDER REORGANIZER MODAL */}
      {reorganizeModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setReorganizeModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-indigo-200 dark:border-indigo-500/40 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[88vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/40">
                  <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">AI Smart Folder Reorganizer</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      Neural Heuristics Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Automatically analyze files, metadata, and contents to group them into intelligent, domain-named folders
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReorganizeModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Strategy Selectors */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-1.5 rounded-xl text-xs overflow-x-auto">
              <span className="text-slate-600 dark:text-slate-400 px-2 font-semibold flex-shrink-0">Clustering Mode:</span>
              {[
                { id: 'ai', label: '✦ AI Semantic Clustering', icon: Sparkles, highlight: true },
                { id: 'type', label: 'File Type (Docs, Media, Code...)', icon: Boxes },
                { id: 'date', label: 'Date (Year / Month)', icon: Clock },
                { id: 'extension', label: 'Extension (.pdf, .ts...)', icon: Filter }
              ].map((s) => {
                const IconComponent = s.icon
                const active = reorganizeModal.strategy === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => handleChangeReorganizeStrategy(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all flex-shrink-0 ${
                      active
                        ? s.highlight
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-white/5'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${s.highlight && active ? 'text-amber-300' : ''}`} />
                    <span>{s.label}</span>
                  </button>
                )
              })}
            </div>

            {/* AI Callout Banner */}
            {reorganizeModal.strategy === 'ai' && (
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-50 dark:from-indigo-500/10 via-purple-50 dark:via-purple-500/10 to-pink-50 dark:to-pink-500/10 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="leading-snug">
                  <strong>AI Smart Classifier:</strong> Scans naming patterns, extensions, and sample bytes to automatically generate smart domain folders (e.g., <em>Financial Invoices & Receipts</em>, <em>Career & Job Applications</em>, <em>Design & UI Assets</em>, <em>Software Schemas</em>).
                </span>
              </div>
            )}

            {/* Planned Categories Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setReorganizeModal((prev) => ({ ...prev, categoryFilter: 'all' }))}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  reorganizeModal.categoryFilter === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-100 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>All Categories</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-black/30 text-[10px]">
                  {reorganizeModal.previewMoves.length}
                </span>
              </button>
              {Object.entries(reorganizeModal.categoryCounts).map(([cat, count]) => {
                const isSelected = reorganizeModal.categoryFilter === cat
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setReorganizeModal((prev) => ({
                        ...prev,
                        categoryFilter: prev.categoryFilter === cat ? 'all' : cat
                      }))
                    }
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 dark:bg-indigo-500/30 border-indigo-600 dark:border-indigo-400 text-white dark:text-indigo-200 shadow-sm'
                        : 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20'
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-500" />
                    <span>{cat}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-indigo-200 dark:bg-indigo-500/30 text-[10px] font-bold text-indigo-900 dark:text-white">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search & Selection Sub-bar */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 max-w-sm bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter preview files or destinations..."
                  value={reorganizeModal.searchFilter || ''}
                  onChange={(e) =>
                    setReorganizeModal((prev) => ({ ...prev, searchFilter: e.target.value }))
                  }
                  className="bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 text-xs w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {reorganizeModal.searchFilter && (
                  <button
                    onClick={() => setReorganizeModal((prev) => ({ ...prev, searchFilter: '' }))}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const filtered = reorganizeModal.previewMoves
                      .filter((m) =>
                        reorganizeModal.categoryFilter === 'all'
                          ? true
                          : m.category === reorganizeModal.categoryFilter
                      )
                      .filter((m) =>
                        reorganizeModal.searchFilter
                          ? m.filename.toLowerCase().includes(reorganizeModal.searchFilter.toLowerCase()) ||
                            m.category.toLowerCase().includes(reorganizeModal.searchFilter.toLowerCase())
                          : true
                      )
                    handleToggleSelectAllMoves(filtered.map((m) => m.src))
                  }}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Toggle Visible Selection
                </button>
                <span className="text-slate-400 dark:text-slate-600">|</span>
                <span className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">{reorganizeModal.selectedMoves.size}</strong> of {reorganizeModal.previewMoves.length} selected
                </span>
              </div>
            </div>

            {/* Moves Table Preview */}
            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/40 p-2 max-h-64 text-xs">
              {reorganizeModal.loading ? (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 dark:text-indigo-400" />
                  <span className="font-medium">AI is classifying files and generating intelligent folders...</span>
                </div>
              ) : reorganizeModal.previewMoves.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1">
                  <FolderTree className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-1" />
                  <span>No unorganized files found in this directory.</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-600">All files are already cleanly grouped.</span>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-white/10">
                      <th className="py-1 px-2 w-7">
                        <input
                          type="checkbox"
                          checked={
                            reorganizeModal.previewMoves.length > 0 &&
                            reorganizeModal.previewMoves.every((m) =>
                              reorganizeModal.selectedMoves.has(m.src)
                            )
                          }
                          onChange={() =>
                            handleToggleSelectAllMoves(reorganizeModal.previewMoves.map((m) => m.src))
                          }
                          className="rounded border-slate-300 dark:border-white/20 text-indigo-600 focus:ring-0"
                        />
                      </th>
                      <th className="py-1 px-2 font-bold">Source File</th>
                      <th className="py-1 px-2 font-bold">Smart Destination Folder</th>
                      <th className="py-1 px-2 font-bold">AI Rationale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reorganizeModal.previewMoves
                      .filter((m) =>
                        reorganizeModal.categoryFilter === 'all'
                          ? true
                          : m.category === reorganizeModal.categoryFilter
                      )
                      .filter((m) =>
                        reorganizeModal.searchFilter
                          ? m.filename.toLowerCase().includes(reorganizeModal.searchFilter.toLowerCase()) ||
                            m.category.toLowerCase().includes(reorganizeModal.searchFilter.toLowerCase())
                          : true
                      )
                      .map((m) => {
                        const isChecked = reorganizeModal.selectedMoves.has(m.src)
                        const isEditing = reorganizeModal.editingSrc === m.src
                        return (
                          <tr
                            key={m.src}
                            className={`hover:bg-slate-100 dark:hover:bg-white/5 border-b border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 transition-colors ${
                              !isChecked ? 'opacity-40' : ''
                            }`}
                          >
                            <td className="py-1.5 px-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleSelectMove(m.src)}
                                className="rounded border-slate-300 dark:border-white/20 text-indigo-600 focus:ring-0"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <div className="flex items-center gap-1.5 max-w-[220px] truncate" title={m.filename}>
                                <File className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{m.filename}</span>
                              </div>
                            </td>
                            <td className="py-1.5 px-2">
                              {isEditing ? (
                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={reorganizeModal.editingFolderName}
                                    onChange={(e) =>
                                      setReorganizeModal((prev) => ({
                                        ...prev,
                                        editingFolderName: e.target.value
                                      }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleUpdateMoveCategory(m.src, reorganizeModal.editingFolderName)
                                      if (e.key === 'Escape') setReorganizeModal((prev) => ({ ...prev, editingSrc: null, editingFolderName: '' }))
                                    }}
                                    autoFocus
                                    className="px-2 py-0.5 rounded bg-white dark:bg-black/60 border border-indigo-400 text-xs text-slate-900 dark:text-white outline-none w-48 shadow-sm"
                                  />
                                  <button
                                    onClick={() => handleUpdateMoveCategory(m.src, reorganizeModal.editingFolderName)}
                                    className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                                    title="Save Folder Name"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setReorganizeModal((prev) => ({ ...prev, editingSrc: null, editingFolderName: '' }))}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                    title="Cancel Edit"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 group">
                                  <Folder className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                                    {m.category}/
                                  </span>
                                  <button
                                    onClick={() =>
                                      setReorganizeModal((prev) => ({
                                        ...prev,
                                        editingSrc: m.src,
                                        editingFolderName: m.category
                                      }))
                                    }
                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-opacity"
                                    title="Customize folder name"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="py-1.5 px-2">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/25 text-[11px] text-purple-700 dark:text-purple-300 font-medium truncate max-w-[260px]"
                                title={m.reason}
                              >
                                <Sparkles className="w-2.5 h-2.5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                                <span className="truncate">{m.reason}</span>
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Risk: Existing file collisions automatically append <em>- Copy</em> without overwrite.</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setReorganizeModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReorganize}
                  disabled={
                    reorganizeModal.loading ||
                    reorganizeModal.selectedMoves.size === 0
                  }
                  className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 disabled:opacity-40 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Execute AI Organization ({reorganizeModal.selectedMoves.size} files)
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. NEW FEATURE: STORAGE OPTIMIZER & JUNK CLEANER MODAL */}
      {cleanerModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setCleanerModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-emerald-200 dark:border-emerald-500/40 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Storage Optimizer & Temp Junk Cleaner</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Reclaim disk space by safely removing caches, .DS_Store, and logs</p>
                </div>
              </div>
              <button onClick={() => setCleanerModal((prev) => ({ ...prev, isOpen: false }))} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Glowing Reclaimable Space Stat Banner */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 dark:from-emerald-950/40 via-emerald-100/30 dark:via-slate-900 to-white dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30">
              <div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  Total Reclaimable Space
                </span>
                <div className="text-2xl font-black text-emerald-950 dark:text-white font-mono mt-0.5">
                  {formatBytes(cleanerModal.totalReclaimable)}
                </div>
              </div>
              <button
                onClick={handleToggleAllJunk}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 underline font-medium"
              >
                {cleanerModal.selectedJunkPaths.size === cleanerModal.junkItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Junk Items List */}
            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/40 p-2 max-h-64 text-xs">
              {cleanerModal.scanning ? (
                <div className="h-32 flex items-center justify-center text-slate-500 dark:text-slate-400 gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-emerald-500 dark:text-emerald-400" />
                  <span>Scanning folder for safe-to-clean junk files...</span>
                </div>
              ) : cleanerModal.junkItems.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 gap-1.5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Clean! No temporary or junk files detected.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {cleanerModal.junkItems.map((item) => {
                    const isChecked = cleanerModal.selectedJunkPaths.has(item.path)
                    return (
                      <div
                        key={item.path}
                        onClick={() => handleToggleJunkItem(item.path)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 text-emerald-950 dark:text-white'
                            : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded accent-emerald-500"
                          />
                          <div>
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.description}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          {formatBytes(item.size)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                {cleanerModal.selectedJunkPaths.size} of {cleanerModal.junkItems.length} items selected to move to Trash
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCleanerModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteCleanJunk}
                  disabled={cleanerModal.cleaning || cleanerModal.selectedJunkPaths.size === 0}
                  className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-medium shadow-md transition-colors flex items-center gap-1.5"
                >
                  {cleanerModal.cleaning ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Clean & Reclaim Space</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. BIG FEATURE 1: APP UNINSTALLER & DEEP RESIDUAL CLEANER MODAL */}
      {uninstallerModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setUninstallerModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="w-full max-w-4xl rounded-2xl border border-rose-200 dark:border-rose-500/40 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[88vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-orange-500/20 border border-rose-500/40">
                  <PackageX className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">App Uninstaller & Deep Cleaner</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                      Zero Residual Leftovers
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Completely remove installed applications along with hidden Application Support, Caches, Preferences, and Containers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUninstallerModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-1 rounded-xl text-xs">
              <button
                onClick={() => setUninstallerModal((prev) => ({ ...prev, tab: 'apps' }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  uninstallerModal.tab === 'apps'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <AppWindow className="w-3.5 h-3.5" />
                <span>Installed Applications ({uninstallerModal.apps.length})</span>
              </button>
              <button
                onClick={() => {
                  setUninstallerModal((prev) => ({ ...prev, tab: 'orphans' }))
                  if (uninstallerModal.orphanItems.length === 0) handleScanOrphanLeftovers()
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  uninstallerModal.tab === 'orphans'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 text-orange-500" />
                <span>Orphan Residual Junk Hunter</span>
              </button>
            </div>

            {uninstallerModal.tab === 'apps' ? (
              <div className="flex-1 flex gap-4 overflow-hidden min-h-[380px]">
                {/* Left: App List */}
                <div className="w-80 flex flex-col gap-2 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/60 dark:bg-black/30 p-2.5">
                  <div className="flex items-center gap-2 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs shadow-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={uninstallerModal.searchQuery}
                      onChange={(e) => setUninstallerModal((prev) => ({ ...prev, searchQuery: e.target.value }))}
                      className="bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 text-xs w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-xs">
                    {uninstallerModal.loading ? (
                      <div className="h-40 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                        <RefreshCw className="w-4 h-4 animate-spin text-rose-500 dark:text-rose-400" />
                        <span>Scanning /Applications...</span>
                      </div>
                    ) : (
                      uninstallerModal.apps
                        .filter((a) => a.name.toLowerCase().includes(uninstallerModal.searchQuery.toLowerCase()))
                        .map((app) => {
                          const isSelected = uninstallerModal.selectedApp?.path === app.path
                          return (
                            <button
                              key={app.path}
                              onClick={() => handleSelectAppToInspect(app)}
                              className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                                isSelected
                                  ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-slate-900 dark:text-white'
                                  : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-rose-600 dark:text-rose-400">
                                  <AppWindow className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <div className="font-semibold text-xs truncate flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                                    <span>{app.name}</span>
                                    {app.isSystem && (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">System</span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">v{app.version}</div>
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            </button>
                          )
                        })
                    )}
                  </div>
                </div>

                {/* Right: Deep Footprint & Leftovers */}
                <div className="flex-1 flex flex-col gap-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/60 dark:bg-black/30 p-4 overflow-y-auto text-xs">
                  {uninstallerModal.appDetailsLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-rose-500 dark:text-rose-400" />
                      <span>Deep scanning Library for Application Support, Caches & Plists...</span>
                    </div>
                  ) : !uninstallerModal.appFootprint ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      Select an application to view full disk footprint and leftovers
                    </div>
                  ) : (
                    <>
                      {/* App Summary Card */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-50 dark:from-rose-950/30 via-pink-50/30 dark:via-slate-900 to-white dark:to-slate-900 border border-rose-200 dark:border-rose-500/30 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{uninstallerModal.selectedApp?.name}</h4>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">v{uninstallerModal.selectedApp?.version}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate max-w-sm">
                            {uninstallerModal.selectedApp?.bundleId}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-bold tracking-wider">Total Footprint</span>
                          <div className="text-lg font-black font-mono text-rose-950 dark:text-white">
                            {formatBytes(uninstallerModal.appFootprint.totalFootprint)}
                          </div>
                        </div>
                      </div>

                      {/* Header controls for leftovers */}
                      <div className="flex items-center justify-between pt-1 text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                          Associated Components ({1 + uninstallerModal.appFootprint.leftovers.length} files/folders)
                        </span>
                        <button
                          onClick={handleToggleAllUninstallerPaths}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                        >
                          {uninstallerModal.selectedPathsToClean.size === 1 + uninstallerModal.appFootprint.leftovers.length
                            ? 'Deselect All'
                            : 'Select All (Full Clean)'}
                        </button>
                      </div>

                      {/* Components List */}
                      <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                        {/* Main App Bundle */}
                        <div
                          onClick={() => handleToggleUninstallerPath(uninstallerModal.appFootprint.appBundle.path)}
                          className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                            uninstallerModal.selectedPathsToClean.has(uninstallerModal.appFootprint.appBundle.path)
                              ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40 text-slate-900 dark:text-white'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={uninstallerModal.selectedPathsToClean.has(uninstallerModal.appFootprint.appBundle.path)}
                              onChange={() => {}}
                              className="rounded accent-rose-500"
                            />
                            <div className="truncate">
                              <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                                <span>Main Application Executable Bundle</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
                                  App Binary
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block font-mono">
                                {uninstallerModal.appFootprint.appBundle.path}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-rose-700 dark:text-rose-300 flex-shrink-0">
                            {formatBytes(uninstallerModal.appFootprint.appBundle.size)}
                          </span>
                        </div>

                        {/* Leftover Residuals */}
                        {uninstallerModal.appFootprint.leftovers.map((l) => {
                          const isChecked = uninstallerModal.selectedPathsToClean.has(l.path)
                          return (
                            <div
                              key={l.path}
                              onClick={() => handleToggleUninstallerPath(l.path)}
                              className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40 text-slate-900 dark:text-white'
                                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="rounded accent-rose-500"
                                />
                                <div className="truncate">
                                  <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                                    <span>{l.name}</span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                                      {l.category}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block font-mono">
                                    {l.path}
                                  </span>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-amber-600 dark:text-amber-300 flex-shrink-0">
                                {formatBytes(l.size)}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Action footer for single app */}
                      <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Safe Removal: Items are moved to macOS Trash first for easy recovery.</span>
                        </div>
                        <button
                          onClick={handleExecuteDeepUninstall}
                          disabled={uninstallerModal.uninstalling || uninstallerModal.selectedPathsToClean.size === 0}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-95 disabled:opacity-40 text-white font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2"
                        >
                          {uninstallerModal.uninstalling ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <PackageX className="w-4 h-4" />
                          )}
                          <span>
                            Deep Uninstall & Clean ({uninstallerModal.selectedPathsToClean.size} items)
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Tab 2: Orphan Leftover Residual Junk Hunter */
              <div className="flex-1 flex flex-col gap-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/60 dark:bg-black/30 p-4 text-xs overflow-y-auto min-h-[380px]">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-orange-50 dark:from-orange-950/30 to-white dark:to-slate-900 border border-orange-200 dark:border-orange-500/30">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-orange-500" />
                      Orphan Residual Junk Hunter
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Scans ~/Library for abandoned caches, state, and support folders left behind by uninstalled apps
                    </p>
                  </div>
                  <button
                    onClick={handleScanOrphanLeftovers}
                    disabled={uninstallerModal.orphanLoading}
                    className="px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-600/20 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-600/30 border border-orange-200 dark:border-orange-500/30 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${uninstallerModal.orphanLoading ? 'animate-spin' : ''}`} />
                    <span>Rescan Orphans</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {uninstallerModal.orphanLoading ? (
                    <div className="h-40 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-orange-500 dark:text-orange-400" />
                      <span>Scanning ~/Library for orphaned application data...</span>
                    </div>
                  ) : uninstallerModal.orphanItems.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 gap-1.5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                      <p className="font-semibold text-slate-800 dark:text-slate-200">No orphan application leftovers found!</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Your library directories are cleanly synchronized.</p>
                    </div>
                  ) : (
                    uninstallerModal.orphanItems.map((item) => {
                      const isChecked = uninstallerModal.selectedOrphanPaths.has(item.path)
                      return (
                        <div
                          key={item.path}
                          onClick={() => {
                            setUninstallerModal((prev) => {
                              const next = new Set(prev.selectedOrphanPaths)
                              if (next.has(item.path)) next.delete(item.path)
                              else next.add(item.path)
                              return { ...prev, selectedOrphanPaths: next }
                            })
                          }}
                          className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-500/40 text-slate-900 dark:text-white'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded accent-orange-500"
                            />
                            <div className="truncate">
                              <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                                <span>{item.name}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                                  {item.category}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block font-mono">{item.path}</span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-orange-600 dark:text-orange-400 flex-shrink-0">
                            {formatBytes(item.size)}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    {uninstallerModal.selectedOrphanPaths.size} of {uninstallerModal.orphanItems.length} orphan items selected
                  </span>
                  <button
                    onClick={handleExecuteCleanOrphans}
                    disabled={uninstallerModal.orphanLoading || uninstallerModal.selectedOrphanPaths.size === 0}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-bold shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Purge Selected Orphan Leftovers</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. BIG FEATURE 2: SYSTEM PERFORMANCE ENHANCER & TASK MANAGER MODAL */}
      {perfModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPerfModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="w-full max-w-4xl rounded-2xl border border-amber-200 dark:border-amber-500/40 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[88vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/40">
                  <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Performance Improvement Enhancer</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      Live Hardware Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Real-time CPU/RAM activity monitor, process task killer, memory defragmenter, and system cache flusher
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPerfModal((prev) => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    perfModal.autoRefresh
                      ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {perfModal.autoRefresh ? '● Live Telemetry On' : '○ Paused'}
                </button>
                <button
                  onClick={handleRefreshPerfStats}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  title="Refresh Hardware Telemetry"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPerfModal((prev) => ({ ...prev, isOpen: false }))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Hardware Telemetry 3-Card HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* CPU Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-sky-500 dark:text-sky-400" /> CPU Load
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{perfModal.stats?.cpu?.cores || 8} Cores</span>
                </div>
                <div className="my-2">
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white flex items-baseline gap-1">
                    <span>{perfModal.stats?.cpu?.usagePercent || 15}%</span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 font-sans">utilized</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        (perfModal.stats?.cpu?.usagePercent || 15) > 80
                          ? 'bg-rose-500'
                          : (perfModal.stats?.cpu?.usagePercent || 15) > 50
                          ? 'bg-amber-400'
                          : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                      }`}
                      style={{ width: `${perfModal.stats?.cpu?.usagePercent || 15}%` }}
                    />
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {perfModal.stats?.cpu?.model || 'Apple Silicon'}
                </div>
              </div>

              {/* Memory / RAM Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-500 dark:text-purple-400" /> RAM Memory
                  </span>
                  <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300">
                    {perfModal.stats?.memory ? formatBytes(perfModal.stats.memory.freeBytes) : '12 GB'} Free
                  </span>
                </div>
                <div className="my-2">
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white flex items-baseline gap-1">
                    <span>{perfModal.stats?.memory?.usedPercent || 50}%</span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 font-sans">in use</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${perfModal.stats?.memory?.usedPercent || 50}%` }}
                    />
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
                  <span>{perfModal.stats?.memory ? formatBytes(perfModal.stats.memory.usedBytes) : '18 GB'}</span>
                  <span>/ {perfModal.stats?.memory ? formatBytes(perfModal.stats.memory.totalBytes) : '36 GB'}</span>
                </div>
              </div>

              {/* System Uptime & Platform Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-400 flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Platform & Health
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Optimal</span>
                </div>
                <div className="my-2">
                  <div className="text-xl font-black font-mono text-slate-900 dark:text-white truncate">
                    macOS {perfModal.stats?.arch || 'arm64'}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Uptime: <strong className="text-slate-900 dark:text-slate-200 font-mono">
                      {perfModal.stats?.uptimeSeconds
                        ? `${Math.floor(perfModal.stats.uptimeSeconds / 86400)}d ${Math.floor((perfModal.stats.uptimeSeconds % 86400) / 3600)}h ${Math.floor((perfModal.stats.uptimeSeconds % 3600) / 60)}m`
                        : '1d 4h'}
                    </strong>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Kernel write buffer verified
                </div>
              </div>
            </div>

            {/* Quick Performance Boost Action Center */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-50 dark:from-amber-950/20 via-purple-50 dark:via-purple-950/20 to-sky-50 dark:to-sky-950/20 border border-amber-200 dark:border-amber-500/30 text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mr-2">
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" /> 1-Click Boosters:
              </span>
              <button
                onClick={handleOptimizeMemory}
                disabled={perfModal.optimizingMemory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-600/20 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-600/30 border border-amber-300 dark:border-amber-500/30 font-semibold transition-all shadow-sm"
              >
                {perfModal.optimizingMemory ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                )}
                <span>Free Inactive RAM (Purge Memory)</span>
              </button>
              <button
                onClick={handleFlushDns}
                disabled={perfModal.flushingDns}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-sky-600/20 text-sky-900 dark:text-sky-200 hover:bg-sky-200 dark:hover:bg-sky-600/30 border border-sky-300 dark:border-sky-500/30 font-semibold transition-all shadow-sm"
              >
                {perfModal.flushingDns ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                )}
                <span>Flush macOS DNS Cache</span>
              </button>
              <button
                onClick={handleCleanQuicklook}
                disabled={perfModal.cleaningQuicklook}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-600/20 text-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-600/30 border border-purple-300 dark:border-purple-500/30 font-semibold transition-all shadow-sm"
              >
                {perfModal.cleaningQuicklook ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                )}
                <span>Reset QuickLook Preview Caches</span>
              </button>
            </div>

            {/* Active Processes Task Manager Table */}
            <div className="flex-1 flex flex-col border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/40 p-3 text-xs overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-200">Active Task Manager</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    ({perfModal.processes.length} top resource-heavy processes)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Filter processes..."
                    value={perfModal.processFilter}
                    onChange={(e) => setPerfModal((prev) => ({ ...prev, processFilter: e.target.value }))}
                    className="px-2.5 py-1 rounded bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs outline-none w-40 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                  />
                  <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-black/40 p-0.5 rounded-lg text-[10px]">
                    <button
                      onClick={() => setPerfModal((prev) => ({ ...prev, sortBy: 'cpu' }))}
                      className={`px-2 py-0.5 rounded font-semibold ${
                        perfModal.sortBy === 'cpu' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      CPU %
                    </button>
                    <button
                      onClick={() => setPerfModal((prev) => ({ ...prev, sortBy: 'mem' }))}
                      className={`px-2 py-0.5 rounded font-semibold ${
                        perfModal.sortBy === 'mem' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      RAM MB
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-56">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-white/10">
                      <th className="py-1 px-2 font-bold">Process Name</th>
                      <th className="py-1 px-2 w-16 font-bold">PID</th>
                      <th className="py-1 px-2 w-28 font-bold">CPU %</th>
                      <th className="py-1 px-2 w-28 font-bold">Memory</th>
                      <th className="py-1 px-2 text-right w-24 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfModal.processes
                      .filter((p) => p.name.toLowerCase().includes(perfModal.processFilter.toLowerCase()))
                      .sort((a, b) =>
                        perfModal.sortBy === 'cpu'
                          ? b.cpuPercent - a.cpuPercent
                          : b.memMB - a.memMB
                      )
                      .map((proc) => (
                        <tr
                          key={proc.pid}
                          className="hover:bg-slate-100 dark:hover:bg-white/5 border-b border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <td className="py-1 px-2">
                            <div className="flex items-center gap-2 truncate max-w-[280px]" title={proc.command}>
                              <Cpu className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="font-semibold text-slate-900 dark:text-slate-200 truncate">{proc.name}</span>
                            </div>
                          </td>
                          <td className="py-1 px-2 font-mono text-slate-600 dark:text-slate-400">{proc.pid}</td>
                          <td className="py-1 px-2 font-mono">
                            <span className={proc.cpuPercent > 10 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                              {proc.cpuPercent.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-1 px-2 font-mono">
                            <span className={proc.memMB > 1000 ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                              {proc.memMB} MB
                            </span>
                          </td>
                          <td className="py-1 px-2 text-right">
                            <button
                              onClick={() => handleKillProcess(proc.pid, proc.name)}
                              className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/40 hover:bg-rose-600 text-rose-800 dark:text-rose-300 hover:text-white border border-rose-300 dark:border-rose-500/30 text-[10px] font-semibold transition-colors"
                              title={`Terminate ${proc.name} (PID ${proc.pid})`}
                            >
                              End Task
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                FlowExplorer Performance Engine • Live Activity Monitor & Cache Optimizer
              </span>
              <button
                onClick={() => setPerfModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md transition-colors"
              >
                Close Optimizer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. NEW FEATURE: DUPLICATE FILES FINDER & CLEANER MODAL */}
      {duplicateModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDuplicateModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="w-full max-w-4xl rounded-2xl border border-purple-200 dark:border-purple-500/40 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[88vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-pink-500/20 border border-purple-500/40">
                  <Copy className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Duplicate Files Finder & Cleaner</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                      Byte-for-Byte Verification
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Locate exact duplicated copies consuming storage, automatically keep newest copies, and safely trash redundant duplicates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDuplicateModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Selection Bar */}
            <div className="flex items-center justify-between bg-purple-50/50 dark:bg-black/40 p-3 rounded-xl border border-purple-200 dark:border-purple-500/20 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Total Duplicates: </span>
                  <span className="font-bold font-mono text-purple-700 dark:text-purple-400">{duplicateModal.totalDuplicatesCount} files</span>
                </div>
                <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Wasted Storage: </span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{formatBytes(duplicateModal.totalReclaimableBytes)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const autoSelected = new Set()
                    for (const group of duplicateModal.groups) {
                      for (let i = 1; i < group.files.length; i++) {
                        autoSelected.add(group.files[i].path)
                      }
                    }
                    setDuplicateModal((prev) => ({ ...prev, selectedPaths: autoSelected }))
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-600/30 hover:bg-purple-200 dark:hover:bg-purple-600/50 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 font-semibold transition-all"
                >
                  Keep Newest (Recommended)
                </button>
                <button
                  onClick={() => {
                    const allExceptOne = new Set()
                    for (const group of duplicateModal.groups) {
                      for (let i = 1; i < group.files.length; i++) {
                        allExceptOne.add(group.files[i].path)
                      }
                    }
                    if (duplicateModal.selectedPaths.size === allExceptOne.size) {
                      setDuplicateModal((prev) => ({ ...prev, selectedPaths: new Set() }))
                    } else {
                      setDuplicateModal((prev) => ({ ...prev, selectedPaths: allExceptOne }))
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all border border-slate-200 dark:border-white/10"
                >
                  {duplicateModal.selectedPaths.size > 0 ? 'Deselect All' : 'Select All Copies'}
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {duplicateModal.scanning ? (
                <div className="h-60 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-500 dark:text-purple-400" />
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Scanning directories for byte-level duplicate files...</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Comparing file sizes and cryptographic checksums</span>
                </div>
              ) : duplicateModal.groups.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 gap-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                  <p className="font-semibold text-slate-900 dark:text-slate-200 text-sm">Zero Duplicate Files Found!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your drives are completely free of duplicate redundancy.</p>
                </div>
              ) : (
                duplicateModal.groups.map((group) => {
                  return (
                    <div
                      key={group.id}
                      className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] p-3 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-200">{group.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-bold">
                            {group.files.length} copies
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
                          {formatBytes(group.size * (group.files.length - 1))} wasted
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {group.files.map((file, idx) => {
                          const isSelected = duplicateModal.selectedPaths.has(file.path)
                          const isNewest = idx === 0
                          return (
                            <div
                              key={file.path}
                              onClick={() => {
                                setDuplicateModal((prev) => {
                                  const next = new Set(prev.selectedPaths)
                                  if (next.has(file.path)) next.delete(file.path)
                                  else next.add(file.path)
                                  return { ...prev, selectedPaths: next }
                                })
                              }}
                              className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-500/50 text-slate-900 dark:text-white'
                                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="rounded accent-purple-500"
                                />
                                <div className="truncate">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">{file.name}</span>
                                    {isNewest ? (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                                        Newest Copy (Keep)
                                      </span>
                                    ) : (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                                        Duplicate Copy
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate block">{file.path}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs font-mono flex-shrink-0">
                                <span className="text-slate-500 dark:text-slate-400">{formatDate(file.mtime)}</span>
                                <span className="font-bold text-slate-900 dark:text-white">{formatBytes(file.size)}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                {duplicateModal.selectedPaths.size} files selected for safe removal
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDuplicateModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors border border-slate-200 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCleanDuplicates}
                  disabled={duplicateModal.cleaning || duplicateModal.selectedPaths.size === 0}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all shadow-lg ${
                    duplicateModal.selectedPaths.size > 0
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {duplicateModal.cleaning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Trashing Selected Duplicates...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Selected Duplicates</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. NEW FEATURE: LARGE & OLD FILES MANAGER MODAL */}
      {largeOldModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLargeOldModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="w-full max-w-4xl rounded-2xl border border-yellow-200 dark:border-yellow-500/40 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[88vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/20 via-amber-500/20 to-orange-500/20 border border-yellow-500/40">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Large & Old Files Manager</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30">
                      Storage Recovery
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Locate massive video files, forgotten virtual disks, and untouched archives taking up gigabytes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLargeOldModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs & Summary */}
            <div className="flex items-center justify-between bg-yellow-50/50 dark:bg-black/40 p-2.5 rounded-xl border border-yellow-200 dark:border-yellow-500/20 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLargeOldModal((prev) => ({ ...prev, filter: 'all' }))}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    largeOldModal.filter === 'all'
                      ? 'bg-yellow-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  All Large Files ({largeOldModal.files.length})
                </button>
                <button
                  onClick={() => setLargeOldModal((prev) => ({ ...prev, filter: 'huge' }))}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    largeOldModal.filter === 'huge'
                      ? 'bg-yellow-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Huge (&gt; 500 MB)
                </button>
                <button
                  onClick={() => setLargeOldModal((prev) => ({ ...prev, filter: 'old' }))}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    largeOldModal.filter === 'old'
                      ? 'bg-yellow-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Untouched (&gt; 3 Months)
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const filtered = largeOldModal.files.filter((file) => {
                      if (largeOldModal.filter === 'huge') return file.size > 500 * 1024 * 1024
                      if (largeOldModal.filter === 'old') return file.isOld
                      return true
                    })
                    if (largeOldModal.selectedPaths.size === filtered.length) {
                      setLargeOldModal((prev) => ({ ...prev, selectedPaths: new Set() }))
                    } else {
                      setLargeOldModal((prev) => ({ ...prev, selectedPaths: new Set(filtered.map((f) => f.path)) }))
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all border border-slate-200 dark:border-white/10"
                >
                  {largeOldModal.selectedPaths.size > 0 ? 'Deselect All' : 'Select Filtered'}
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {largeOldModal.scanning ? (
                <div className="h-60 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-yellow-500 dark:text-yellow-400" />
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Scanning drives for large and old archives...</span>
                </div>
              ) : (
                largeOldModal.files
                  .filter((file) => {
                    if (largeOldModal.filter === 'huge') return file.size > 500 * 1024 * 1024
                    if (largeOldModal.filter === 'old') return file.isOld
                    return true
                  })
                  .map((file) => {
                    const isSelected = largeOldModal.selectedPaths.has(file.path)
                    const isGigantic = file.size > 1024 * 1024 * 1024
                    return (
                      <div
                        key={file.path}
                        onClick={() => {
                          setLargeOldModal((prev) => {
                            const next = new Set(prev.selectedPaths)
                            if (next.has(file.path)) next.delete(file.path)
                            else next.add(file.path)
                            return { ...prev, selectedPaths: next }
                          })
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-500/50 text-slate-900 dark:text-white'
                            : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded accent-yellow-500"
                          />
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                            <FileThumbnail item={file} mode="details" />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">{file.name}</span>
                              {file.isOld && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                                  Older than 3 mo
                                </span>
                              )}
                              {isGigantic && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30">
                                  &gt; 1 GB
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate block">{file.path}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono flex-shrink-0">
                          <span className="text-slate-500 dark:text-slate-400">{formatDate(file.mtime)}</span>
                          <span className={`font-bold ${isGigantic ? 'text-rose-600 dark:text-rose-400 text-sm' : 'text-yellow-700 dark:text-yellow-400'}`}>
                            {formatBytes(file.size)}
                          </span>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                {largeOldModal.selectedPaths.size} files selected for trashing
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLargeOldModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors border border-slate-200 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCleanLargeOldFiles}
                  disabled={largeOldModal.trashing || largeOldModal.selectedPaths.size === 0}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all shadow-lg ${
                    largeOldModal.selectedPaths.size > 0
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-yellow-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {largeOldModal.trashing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Moving to Trash...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Move Selected to Trash</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. POWER BATCH RENAMER MODAL */}
      {batchRenameModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setBatchRenameModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f131d] shadow-2xl p-5 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                Power Batch Renamer ({currentPaneState.selectedPaths.size} items)
              </span>
              <button onClick={() => setBatchRenameModal((prev) => ({ ...prev, isOpen: false }))} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-700 dark:text-slate-400 font-medium">Find text</label>
                <input
                  type="text"
                  value={batchRenameModal.findText}
                  onChange={(e) => setBatchRenameModal((prev) => ({ ...prev, findText: e.target.value }))}
                  placeholder="e.g. old_prefix"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-700 dark:text-slate-400 font-medium">Replace with</label>
                <input
                  type="text"
                  value={batchRenameModal.replaceText}
                  onChange={(e) => setBatchRenameModal((prev) => ({ ...prev, replaceText: e.target.value }))}
                  placeholder="e.g. new_prefix"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-700 dark:text-slate-400 font-medium">Add Prefix</label>
                <input
                  type="text"
                  value={batchRenameModal.prefix}
                  onChange={(e) => setBatchRenameModal((prev) => ({ ...prev, prefix: e.target.value }))}
                  placeholder="e.g. Final_"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-700 dark:text-slate-400 font-medium">Add Suffix</label>
                <input
                  type="text"
                  value={batchRenameModal.suffix}
                  onChange={(e) => setBatchRenameModal((prev) => ({ ...prev, suffix: e.target.value }))}
                  placeholder="e.g. _v2"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={batchRenameModal.numbering}
                  onChange={(e) => setBatchRenameModal((prev) => ({ ...prev, numbering: e.target.checked }))}
                  className="rounded accent-indigo-600"
                />
                Append Sequential Numbering (_001, _002...)
              </label>

              <select
                value={batchRenameModal.caseTransform}
                onChange={(e) => setBatchRenameModal((prev) => ({ ...prev, caseTransform: e.target.value }))}
                className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-300 outline-none shadow-sm"
              >
                <option value="none">Case: Preserve</option>
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
                <option value="title">Title Case</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setBatchRenameModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchRenameSubmit}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
              >
                Apply Batch Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. COMMAND PALETTE */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f131d] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-white/10">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                ref={commandInputRef}
                autoFocus
                type="text"
                value={commandQuery}
                onChange={(e) => {
                  setCommandQuery(e.target.value)
                  setCommandSelectedIndex(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setCommandSelectedIndex((prev) => Math.min(commands.length - 1, prev + 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setCommandSelectedIndex((prev) => Math.max(0, prev - 1))
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    if (commands[commandSelectedIndex]) {
                      commands[commandSelectedIndex].action()
                      setCommandPaletteOpen(false)
                    }
                  } else if (e.key === 'Escape') {
                    setCommandPaletteOpen(false)
                  }
                }}
                placeholder="Type a command or location..."
                className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-0.5">
              {commands.map((cmd, idx) => {
                const IconComponent = cmd.icon
                const isSelected = idx === commandSelectedIndex
                return (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      cmd.action()
                      setCommandPaletteOpen(false)
                    }}
                    onMouseEnter={() => setCommandSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-medium shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-4 h-4" />
                      <span>{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-black/20 text-[10px] font-mono">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 11. NEW FILE / FOLDER MODAL */}
      {newItemDialog.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setNewItemDialog({ isOpen: false, type: 'folder', name: '' })}
        >
          <div
            className="w-96 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f131d] shadow-2xl p-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-semibold text-sm text-slate-900 dark:text-slate-200 flex items-center gap-2">
              {newItemDialog.type === 'folder' ? <FolderPlus className="w-4 h-4 text-amber-500" /> : <FilePlus className="w-4 h-4 text-sky-500" />}
              Create New {newItemDialog.type === 'folder' ? 'Folder' : 'File'}
            </div>
            <input
              ref={newItemInputRef}
              type="text"
              autoFocus
              value={newItemDialog.name}
              onChange={(e) => setNewItemDialog((prev) => ({ ...prev, name: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitNewItem()
                if (e.key === 'Escape') setNewItemDialog({ isOpen: false, type: 'folder', name: '' })
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-200 text-xs font-mono shadow-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNewItemDialog({ isOpen: false, type: 'folder', name: '' })}
                className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={submitNewItem}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. CUSTOM RIGHT-CLICK CONTEXT MENU */}
      {contextMenu.visible && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 w-56 rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0f131d]/95 backdrop-blur-md shadow-2xl py-1.5 text-xs text-slate-800 dark:text-slate-200 flex flex-col select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item ? (
            <>
              <button
                onClick={() => {
                  handleOpenItem(contextMenu.item)
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left font-medium"
              >
                <CornerDownLeft className="w-3.5 h-3.5" /> Open
              </button>
              {isImageFile(contextMenu.item) && (
                <button
                  onClick={() => {
                    openPhotoGallery(contextMenu.item)
                    setContextMenu((prev) => ({ ...prev, visible: false }))
                  }}
                  className="flex items-center justify-between px-3 py-1.5 hover:bg-purple-600 hover:text-white transition-colors text-left font-semibold text-purple-700 dark:text-purple-300"
                >
                  <div className="flex items-center gap-2"><Images className="w-3.5 h-3.5" /> View in Photo Gallery</div>
                  <kbd className="text-[10px] opacity-60">Enter</kbd>
                </button>
              )}
              <button
                onClick={() => {
                  setQuickLookItem(contextMenu.item)
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-sky-500" /> Quick Look</div>
                <kbd className="text-[10px] opacity-60">Space</kbd>
              </button>
              <button
                onClick={() => {
                  toggleFavorite(contextMenu.item.path)
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Pin to Favorites
              </button>
              <button
                onClick={() => {
                  handleAddToShelf()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <Layers className="w-3.5 h-3.5 text-amber-500" /> Add to Drop Shelf
              </button>

              <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  api.openTerminal(contextMenu.item.isDirectory ? contextMenu.item.path : currentPaneState.path)
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" /> Open in Terminal
              </button>
              <button
                onClick={() => {
                  api.openVSCode(contextMenu.item.path)
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <Code2 className="w-3.5 h-3.5 text-sky-500" /> Open in VS Code
              </button>

              <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  handleCut()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><Scissors className="w-3.5 h-3.5" /> Cut</div>
                <kbd className="text-[10px] opacity-60">Ctrl+X</kbd>
              </button>
              <button
                onClick={() => {
                  handleCopy()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Copy</div>
                <kbd className="text-[10px] opacity-60">Ctrl+C</kbd>
              </button>
              {clipboard.items && clipboard.items.length > 0 && (
                <button
                  onClick={() => {
                    handlePaste()
                    setContextMenu((prev) => ({ ...prev, visible: false }))
                  }}
                  className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left font-medium text-indigo-600 dark:text-indigo-400"
                >
                  <div className="flex items-center gap-2"><ClipboardPaste className="w-3.5 h-3.5" /> Paste ({clipboard.items.length})</div>
                  <kbd className="text-[10px] opacity-60">Ctrl+V</kbd>
                </button>
              )}
              <button
                onClick={() => {
                  startInlineRename(contextMenu.item)
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><Edit3 className="w-3.5 h-3.5" /> Rename</div>
                <kbd className="text-[10px] opacity-60">F2</kbd>
              </button>
              <button
                onClick={() => {
                  copyPathToClipboard(contextMenu.item.path)
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Full Path
              </button>
              <button
                onClick={() => {
                  handleSelectAll()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-slate-400" /> Select All</div>
                <kbd className="text-[10px] opacity-60">Ctrl+A</kbd>
              </button>

              <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  handleDeleteToTrash()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 transition-colors text-left"
              >
                <div className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Move to Trash</div>
                <kbd className="text-[10px] opacity-60">Del</kbd>
              </button>
              <button
                onClick={() => {
                  handleTriggerPermanentDelete()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-rose-700 hover:text-white text-rose-700 dark:text-rose-300 transition-colors text-left font-semibold"
              >
                <div className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5 text-rose-500" /> Delete Permanently</div>
                <kbd className="text-[10px] opacity-60">Shift+Del</kbd>
              </button>
            </>
          ) : (
            <>
              {/* Empty Space Folder Context Menu */}
              <button
                onClick={() => {
                  handlePaste()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                disabled={!clipboard.items || clipboard.items.length === 0}
                className={`flex items-center justify-between px-3 py-1.5 transition-colors text-left font-medium ${
                  clipboard.items && clipboard.items.length > 0
                    ? 'hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-400 dark:text-slate-600 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  Paste {clipboard.items && clipboard.items.length > 0 ? `(${clipboard.items.length})` : ''}
                </div>
                <kbd className="text-[10px] opacity-60">Ctrl+V</kbd>
              </button>
              <button
                onClick={() => {
                  handleSelectAll()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Select All</div>
                <kbd className="text-[10px] opacity-60">Ctrl+A</kbd>
              </button>
              <button
                onClick={() => {
                  handleUndo()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                disabled={undoStack.length === 0}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-colors text-left"
              >
                <div className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5" /> Undo</div>
                <kbd className="text-[10px] opacity-60">Ctrl+Z</kbd>
              </button>

              <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  setNewItemDialog({ isOpen: true, type: 'folder', name: 'New Folder' })
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                  setTimeout(() => newItemInputRef.current?.select(), 50)
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><FolderPlus className="w-3.5 h-3.5 text-amber-500" /> New Folder</div>
                <kbd className="text-[10px] opacity-60">Ctrl+Shift+N</kbd>
              </button>
              <button
                onClick={() => {
                  setNewItemDialog({ isOpen: true, type: 'file', name: 'untitled.txt' })
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                  setTimeout(() => newItemInputRef.current?.select(), 50)
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><FilePlus className="w-3.5 h-3.5 text-sky-500" /> New File</div>
                <kbd className="text-[10px] opacity-60">Ctrl+N</kbd>
              </button>

              <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  refreshCurrent()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Refresh</div>
                <kbd className="text-[10px] opacity-60">F5</kbd>
              </button>
              <button
                onClick={() => {
                  copyPathToClipboard()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Directory Path
              </button>

              <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  handleOpenTerminal()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" /> Open in Terminal
              </button>
              <button
                onClick={() => {
                  handleOpenVSCode()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left"
              >
                <Code2 className="w-3.5 h-3.5 text-sky-500" /> Open in VS Code
              </button>

              <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  handleOpenReorganizeModal()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors text-left font-medium text-indigo-600 dark:text-indigo-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> AI Smart Reorganize...
              </button>
              <button
                onClick={() => {
                  handleOpenCleanerModal()
                  setContextMenu((prev) => ({ ...prev, visible: false }))
                }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-emerald-600 hover:text-white transition-colors text-left font-medium text-emerald-600 dark:text-emerald-300"
              >
                <Trash2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Clean Junk & Storage...
              </button>
            </>
          )}
        </div>
      )}

      {/* 12b. PERMANENT DELETE CONFIRMATION MODAL (Shift+Delete) */}
      {permDeleteModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPermDeleteModal({ isOpen: false, paths: [] })}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0f131d] border border-slate-200 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-4 text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Permanently Delete {permDeleteModal.paths.length} Item{permDeleteModal.paths.length > 1 ? 's' : ''}?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  These items will be permanently erased from your storage disk without going to the Recycle Bin / Trash. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="max-h-36 overflow-y-auto rounded-lg bg-slate-100 dark:bg-black/30 p-2.5 text-xs font-mono text-slate-700 dark:text-slate-300 flex flex-col gap-1 border border-slate-200 dark:border-white/5">
              {permDeleteModal.paths.map((p) => (
                <div key={p} className="truncate flex items-center gap-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span className="truncate">{p.split('/').pop()}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setPermDeleteModal({ isOpen: false, paths: [] })}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Cancel (Esc)
              </button>
              <button
                onClick={executePermanentDelete}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 13. TOAST NOTIFICATIONS */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border shadow-xl text-xs font-medium pointer-events-auto backdrop-blur-md transition-all ${
              t.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 shadow-rose-500/10'
                : t.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 shadow-amber-500/10'
                : t.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-emerald-500/10'
                : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />}
            {t.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />}
            {t.type === 'success' && <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />}
            {t.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* 14. ABOUT FLOWEXPLORER MODAL */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative iridescent accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />
            
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Logo Squircle */}
            <div className="relative my-4 group">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-fuchsia-500/40 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
              <img
                src={flowLogo}
                alt="FlowExplorer Logo"
                className="relative w-24 h-24 rounded-2xl shadow-2xl ring-2 ring-white/20 object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">FlowExplorer</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                PRO EDITION
              </span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">Version 1.0.0 (Build 2026.10) • Open Source</p>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 max-w-md leading-relaxed text-center">
              The next-generation desktop file system architected for macOS & Windows power users. Seamlessly unites the high-productivity keyboard ergonomics of Windows 11 Explorer with Liquid Glassmorphism, Dual Split-Pane browsing, and AI-powered storage intelligence.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-2 w-full mt-4 text-left text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-200">Win 11 Action Ribbon</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">F2 rename, Enter to open, Ctrl+C/X/V/Z, Shift+Del</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-200">AI Storage Intelligence</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Heuristic folder reorganizer & category clustering</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-start gap-2">
                <Trash2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-200">Deep Cleaner & Storage</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">App uninstaller + residual cache purging</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-start gap-2">
                <Gauge className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-200">System Performance</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Live RAM purge, DNS flush & task killer</div>
                </div>
              </div>
            </div>

            {/* System Info & Repository Footnote */}
            <div className="w-full mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <a
                href="https://github.com/smartjaganrao/flow-explorer"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition-colors"
              >
                <span>github.com/smartjaganrao/flow-explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => {
                  setShowAboutModal(false)
                  setShowShortcutsModal(true)
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-sans font-medium flex items-center gap-1 transition-colors"
              >
                <span>View Shortcuts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 15. KEYBOARD SHORTCUTS CHEAT SHEET MODAL */}
      {showShortcutsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Keyboard Shortcuts Cheat Sheet</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Full Windows 11 Explorer ergonomics combined with macOS power keys</p>
                </div>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Windows 11 Navigation & File Operations
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Cut Selected (Move)</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Ctrl+X / ⌘X</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Copy Selected</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Ctrl+C / ⌘C</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Paste / Move Here</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Ctrl+V / ⌘V</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Select All Files</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Ctrl+A / ⌘A</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Undo Last Action</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Ctrl+Z / ⌘Z</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Range Selection</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Shift + Click</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Toggle Multi-Select</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Ctrl + Click</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Inline Rename</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">F2</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Open Folder / File</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Up One Folder Level</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Backspace / Alt+↑</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">History Back / Forward</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Alt+← / Alt+→</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">New Folder</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Ctrl+Shift+N</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">New File</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Ctrl+N</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Move to Trash</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">Delete / Ctrl+D</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Permanent Delete</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 border border-slate-300 dark:border-white/10">Shift+Delete</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Refresh Directory</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-white/10">F5 / Ctrl+R</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" /> Workspace & Multi-Tasking
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Command Palette</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-white/10">⌘K</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Toggle Dual Split-Pane</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-white/10">⌘\</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">New Tab</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-white/10">⌘T</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Close Current Tab</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-white/10">⌘W</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Embedded Terminal Drawer</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-white/10">Ctrl+`</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Quick Look File Preview</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-white/10">Space</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Power Batch Renamer</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-white/10">⌘+Shift+R</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Toggle Hidden Files</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-white/10">⌘. / ⌘+Shift+.</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI & Clean Power Suites
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">AI Folder Reorganizer</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 border border-slate-300 dark:border-white/10">Shift+A / Ribbon</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Clean Junk & Reclaim Space</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 border border-slate-300 dark:border-white/10">Ribbon Action</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Deep App Uninstaller</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 border border-slate-300 dark:border-white/10">Ribbon Action</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Performance Enhancer</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 border border-slate-300 dark:border-white/10">Ribbon Action</kbd>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Press <kbd className="px-1 rounded bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 font-mono text-[10px]">Esc</kbd> to close any dialog</span>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 16. INBUILT PHOTO GALLERY FULLSCREEN LIGHTBOX MODAL */}
      {photoGallery.isOpen && photoGallery.items.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200"
          onClick={() => setPhotoGallery((prev) => ({ ...prev, isOpen: false, isPlaying: false }))}
        >
          {/* Top HUD Controls Bar */}
          <div
            className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md text-white z-40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Images className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-sm tracking-tight">Photo Gallery</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  {photoGallery.currentIndex + 1} / {photoGallery.items.length}
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold truncate max-w-[260px]">
                  {photoGallery.items[photoGallery.currentIndex]?.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatBytes(photoGallery.items[photoGallery.currentIndex]?.size)}
                </span>
              </div>
            </div>

            {/* Center: Zoom & Orientation Controls */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2 py-1">
              <button
                onClick={() => setPhotoGallery((prev) => ({ ...prev, zoom: Math.max(0.25, Number((prev.zoom / 1.25).toFixed(2))) }))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhotoGallery((prev) => ({ ...prev, zoom: 1 }))}
                className="px-2 py-0.5 rounded text-xs font-mono font-bold text-indigo-300 hover:bg-white/10 transition-colors"
                title="Reset Zoom to 100% (0)"
              >
                {Math.round(photoGallery.zoom * 100)}%
              </button>
              <button
                onClick={() => setPhotoGallery((prev) => ({ ...prev, zoom: Math.min(5, Number((prev.zoom * 1.25).toFixed(2))) }))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="h-3.5 w-[1px] bg-white/10 mx-0.5" />
              <button
                onClick={() => setPhotoGallery((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Rotate 90° Clockwise (R)"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPhotoGallery((prev) => ({ ...prev, isFlipped: !prev.isFlipped }))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Flip Horizontal (F)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Slideshow & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPhotoGallery((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  photoGallery.isPlaying
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
                }`}
                title="Toggle Slideshow Play/Pause (Space)"
              >
                {photoGallery.isPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{photoGallery.isPlaying ? 'Playing' : 'Slideshow'}</span>
              </button>

              <button
                onClick={() => {
                  const currentItem = photoGallery.items[photoGallery.currentIndex]
                  if (currentItem) api.openPath(currentItem.path)
                }}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                title="Open in macOS Preview or Default App (O)"
              >
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={async () => {
                  const currentItem = photoGallery.items[photoGallery.currentIndex]
                  if (!currentItem) return
                  await api.trash([currentItem.path])
                  addToast(`Moved ${currentItem.name} to Trash`, 'info')
                  // Remove from active list
                  const updated = photoGallery.items.filter((_, idx) => idx !== photoGallery.currentIndex)
                  if (updated.length === 0) {
                    setPhotoGallery((prev) => ({ ...prev, isOpen: false }))
                  } else {
                    const nextIdx = Math.min(photoGallery.currentIndex, updated.length - 1)
                    setPhotoGallery((prev) => ({
                      ...prev,
                      items: updated,
                      currentIndex: nextIdx
                    }))
                  }
                  refreshCurrent()
                }}
                className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-white/10 transition-colors"
                title="Move Photo to Trash (Delete)"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                title={`Toggle Fullscreen Mode (Double Click or F11) ${isWindowFullScreen ? '(Exit Fullscreen)' : '(Enter Fullscreen)'}`}
              >
                {isWindowFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setPhotoGallery((prev) => ({ ...prev, isOpen: false, isPlaying: false }))}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                title="Close Photo Gallery (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage: Image Viewport with Next & Prev floating controls */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden p-6 cursor-default"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleToggleFullscreen}
            onWheel={(e) => {
              if (e.deltaY < 0) {
                setPhotoGallery((prev) => ({ ...prev, zoom: Math.min(5, Number((prev.zoom * 1.1).toFixed(2))) }))
              } else {
                setPhotoGallery((prev) => ({ ...prev, zoom: Math.max(0.25, Number((prev.zoom / 1.1).toFixed(2))) }))
              }
            }}
          >
            {/* Previous Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrevPhoto()
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 z-40 group cursor-pointer"
              title="Previous Photo (← or PageUp)"
            >
              <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Next Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNextPhoto()
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 z-40 group cursor-pointer"
              title="Next Photo (→ or PageDown)"
            >
              <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Main Center Image */}
            <div className="relative flex items-center justify-center max-w-full max-h-full">
              {photoGallery.loading && !photoGallery.previewData ? (
                <div className="flex flex-col items-center gap-3 text-indigo-400">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-mono">Loading high-res image...</span>
                </div>
              ) : photoGallery.previewData ? (
                <img
                  src={photoGallery.previewData}
                  alt={photoGallery.items[photoGallery.currentIndex]?.name}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    handleToggleFullscreen()
                  }}
                  style={{
                    transform: `scale(${photoGallery.zoom}) rotate(${photoGallery.rotation}deg) scaleX(${photoGallery.isFlipped ? -1 : 1})`,
                    transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="max-h-[66vh] max-w-[85vw] object-contain rounded-xl shadow-2xl select-none cursor-pointer"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <FileImage className="w-16 h-16 opacity-40" />
                  <span className="text-sm">Cannot preview this image format</span>
                  <button
                    onClick={() => {
                      const cur = photoGallery.items[photoGallery.currentIndex]
                      if (cur) api.openPath(cur.path)
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                  >
                    Open in Default App
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Filmstrip Carousel */}
          <div
            className="border-t border-white/10 bg-black/60 backdrop-blur-md p-3 z-40"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={filmstripRef}
              className="flex items-center gap-2.5 overflow-x-auto no-scrollbar max-w-full px-4 py-1"
            >
              {photoGallery.items.map((item, idx) => {
                const isActive = idx === photoGallery.currentIndex
                return (
                  <div
                    key={item.path}
                    onClick={() => {
                      setPhotoGallery((prev) => ({
                        ...prev,
                        currentIndex: idx,
                        zoom: 1,
                        rotation: 0,
                        isFlipped: false
                      }))
                    }}
                    className={`flex-shrink-0 h-14 w-20 rounded-xl overflow-hidden cursor-pointer transition-all border ${
                      isActive
                        ? 'border-indigo-400 ring-2 ring-indigo-400/80 scale-105 shadow-lg shadow-indigo-500/30'
                        : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/90 text-white text-[10px] p-1 text-center font-mono truncate">
                      <FileThumbnail item={item} mode="grid" />
                      <span className="truncate w-full mt-0.5 text-[9px]">{item.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 17. DEFAULT FILE MANAGER & PREFERENCES MODAL */}
      {showDefaultManagerModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowDefaultManagerModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-[#0f131d] shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Preferences & Settings
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-normal">Auto-Saved</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Customize your workspace defaults, startup behavior, and macOS system integration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDefaultManagerModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* SECTION 1: STARTUP & BEHAVIOR */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Startup & Behavior</span>
                </div>
                <div className="space-y-2.5">
                  {/* Card: Auto Launch at macOS Login */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Launch FlowExplorer at System Startup
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                        Automatically boot FlowExplorer in the background when logging into macOS.
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        const next = !loginItemStatus
                        setLoginItemStatus(next)
                        try {
                          localStorage.setItem('flow_login_item_status', JSON.stringify(next))
                        } catch {}
                        if (api.setLoginItemSettings) {
                          await api.setLoginItemSettings({ openAtLogin: next })
                          addToast(next ? 'Enabled launch at login' : 'Disabled launch at login', 'success')
                        }
                      }}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        loginItemStatus ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          loginItemStatus ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card: Inbuilt Photo Gallery */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Open Images in Inbuilt Photo Gallery
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                        Double-clicking images opens FlowExplorer's high-speed gallery with Next & Prev controls.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const next = !useInbuiltGallery
                        setUseInbuiltGallery(next)
                        try {
                          localStorage.setItem('flow_use_inbuilt_gallery', JSON.stringify(next))
                        } catch {}
                        addToast(next ? 'Inbuilt Photo Gallery enabled' : 'Images open in external default app', 'info')
                      }}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        useInbuiltGallery ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          useInbuiltGallery ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card: Restore Last Working Folder */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Restore Last Visited Folder on Launch
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                        Always reopen the folder you were working in when you last quit the app.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const next = !restoreLastFolder
                        setRestoreLastFolder(next)
                        addToast(next ? 'Enabled last folder restore' : 'FlowExplorer will start at Home folder', 'info')
                      }}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        restoreLastFolder ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          restoreLastFolder ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: APPEARANCE & VIEW DEFAULTS */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Appearance & Layout Defaults</span>
                </div>
                <div className="space-y-2.5">
                  {/* Theme Mode */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Interface Theme
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                        Choose your preferred appearance mode.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-white/10 rounded-lg p-1 border border-slate-300 dark:border-white/10">
                      <button
                        onClick={() => setTheme('light')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-indigo-200" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>

                  {/* Default View Mode */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Default View Mode
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                        Choose how files and folders are presented by default.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-white/10 rounded-lg p-1 border border-slate-300 dark:border-white/10">
                      <button
                        onClick={() => updateViewMode('details')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          currentPaneState.viewMode === 'details' ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>Details Table</span>
                      </button>
                      <button
                        onClick={() => updateViewMode('grid')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          currentPaneState.viewMode === 'grid' ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Grid Cards</span>
                      </button>
                    </div>
                  </div>

                  {/* Show Hidden Files (.dotfiles) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Show Hidden Files & Dotfiles
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                        Display files starting with a dot (<code className="font-mono text-indigo-500">.env</code>, <code className="font-mono text-indigo-500">.git</code>, <code className="font-mono text-indigo-500">.zshrc</code>).
                      </p>
                    </div>
                    <button
                      onClick={toggleShowHidden}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentPaneState.showHidden ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          currentPaneState.showHidden ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dual Pane View */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Dual-Pane Split View
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                        Side-by-side file navigation for high-productivity file comparisons and transfers.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsDualPane((prev) => !prev)}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isDualPane ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isDualPane ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Inspector Preview Pane */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Inspector Preview Pane
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                        Right-side sidebar showing live file previews, telemetry, metadata, and SHA-256 checksums.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowInspector((prev) => !prev)}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showInspector ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          showInspector ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: macOS SYSTEM INTEGRATION */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>macOS System Integration</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col gap-2.5">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Set FlowExplorer as Primary File Manager
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed text-[11px]">
                        Registers FlowExplorer Pro as the system directory handler (<code className="font-mono text-indigo-500">public.folder</code>) and custom protocol client (<code className="font-mono text-indigo-500">flowexplorer://</code>).
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
                      <button
                        onClick={async () => {
                          if (api.setDefaultFileManager) {
                            const res = await api.setDefaultFileManager()
                            if (res.success) {
                              addToast('FlowExplorer registered as default protocol client!', 'success')
                            } else {
                              addToast(`Registration note: ${res.error || 'Check permissions'}`, 'info')
                            }
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/20 text-xs"
                      >
                        1-Click Register Protocol
                      </button>
                      <button
                        onClick={() => {
                          api.writeClipboard('duti -s com.smartjaganrao.flowexplorer public.folder all')
                          addToast('Copied duti command to clipboard!', 'success')
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-white/15 transition-all text-xs"
                      >
                        Copy duti Command
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                      <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Launch from Terminal or Scripts</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950 text-slate-200 rounded-lg p-2.5 font-mono text-[11px] border border-white/5">
                      <code>open -a "FlowExplorer Pro" ~/Downloads</code>
                      <button
                        onClick={() => {
                          api.writeClipboard('open -a "FlowExplorer Pro" ~/Downloads')
                          addToast('Command copied to clipboard!', 'success')
                        }}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: RESET TO FACTORY DEFAULTS */}
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-rose-700 dark:text-rose-400">
                    Reset All Preferences
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">
                    Restore factory defaults for themes, view modes, column widths, and pane layouts.
                  </p>
                </div>
                <button
                  onClick={handleResetSettings}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/20 text-xs"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                All changes persist automatically across app restarts.
              </span>
              <button
                onClick={() => setShowDefaultManagerModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/20 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
