import { contextBridge, ipcRenderer } from 'electron'

const explorerAPI = {
  getHome: () => ipcRenderer.invoke('fs:get-home'),
  getVolumes: () => ipcRenderer.invoke('fs:get-volumes'),
  getDiskSpace: () => ipcRenderer.invoke('fs:get-disk-space'),
  getGitStatus: (dirPath) => ipcRenderer.invoke('fs:get-git-status', dirPath),
  calcHash: (filePath) => ipcRenderer.invoke('fs:calc-hash', filePath),
  batchRename: (operations) => ipcRenderer.invoke('fs:batch-rename', operations),
  runCommand: (command, cwd) => ipcRenderer.invoke('fs:run-command', command, cwd),
  readDir: (path, options) => ipcRenderer.invoke('fs:read-dir', path, options),
  readPreview: (path) => ipcRenderer.invoke('fs:read-preview', path),
  getThumbnail: (path) => ipcRenderer.invoke('fs:get-thumbnail', path),
  mkdir: (parentDir, folderName) => ipcRenderer.invoke('fs:mkdir', parentDir, folderName),
  mkfile: (parentDir, fileName) => ipcRenderer.invoke('fs:mkfile', parentDir, fileName),
  rename: (oldPath, newName) => ipcRenderer.invoke('fs:rename', oldPath, newName),
  copy: (sourcePaths, destinationDir) => ipcRenderer.invoke('fs:copy', sourcePaths, destinationDir),
  move: (sourcePaths, destinationDir) => ipcRenderer.invoke('fs:move', sourcePaths, destinationDir),
  trash: (filePaths) => ipcRenderer.invoke('fs:trash', filePaths),
  deletePermanent: (filePaths) => ipcRenderer.invoke('fs:delete-permanent', filePaths),
  writeClipboard: (text) => ipcRenderer.invoke('fs:clipboard-write', text),
  readClipboard: () => ipcRenderer.invoke('fs:clipboard-read'),
  onShortcut: (callback) => {
    const listener = (_e, action) => callback(action)
    ipcRenderer.on('app:shortcut', listener)
    return () => ipcRenderer.removeListener('app:shortcut', listener)
  },
  openPath: (path) => ipcRenderer.invoke('fs:open-path', path),
  openTerminal: (path) => ipcRenderer.invoke('fs:open-terminal', path),
  openVSCode: (path) => ipcRenderer.invoke('fs:open-vscode', path),
  // Smart Folder Reorganizer & Storage Cleaner
  getDiskBreakdown: () => ipcRenderer.invoke('fs:get-disk-breakdown'),
  scanDuplicates: (targetDir) => ipcRenderer.invoke('fs:scan-duplicates', targetDir),
  cleanDuplicates: (paths) => ipcRenderer.invoke('fs:clean-duplicates', paths),
  scanLargeOldFiles: (targetDir) => ipcRenderer.invoke('fs:scan-large-old-files', targetDir),
  scanCleaner: (targetPath) => ipcRenderer.invoke('fs:scan-cleaner', targetPath),
  cleanJunk: (paths) => ipcRenderer.invoke('fs:clean-junk', paths),
  previewReorganize: (targetPath, strategy) => ipcRenderer.invoke('fs:preview-reorganize', targetPath, strategy),
  executeReorganize: (moves) => ipcRenderer.invoke('fs:execute-reorganize', moves),
  // App Uninstaller & Deep Residual Cleaner
  listApps: () => ipcRenderer.invoke('apps:list'),
  scanAppLeftovers: (appData) => ipcRenderer.invoke('apps:scan-deep-leftovers', appData),
  uninstallDeep: (paths) => ipcRenderer.invoke('apps:uninstall-deep', paths),
  scanOrphanLeftovers: () => ipcRenderer.invoke('apps:scan-orphan-leftovers'),
  // Performance Improvement Enhancer & Task Manager
  getSystemPerfStats: () => ipcRenderer.invoke('perf:get-system-stats'),
  listProcesses: () => ipcRenderer.invoke('perf:list-processes'),
  killProcess: (pid) => ipcRenderer.invoke('perf:kill-process', pid),
  optimizeMemory: () => ipcRenderer.invoke('perf:optimize-memory'),
  flushDns: () => ipcRenderer.invoke('perf:flush-dns'),
  cleanQuicklookCache: () => ipcRenderer.invoke('perf:clean-quicklook-cache'),
  // Default File Manager & System Integration
  getInitialPath: () => ipcRenderer.invoke('fs:get-initial-path'),
  onOpenExternalPath: (callback) => {
    const listener = (_e, externalPath) => callback(externalPath)
    ipcRenderer.on('app:open-external-path', listener)
    return () => ipcRenderer.removeListener('app:open-external-path', listener)
  },
  setDefaultFileManager: () => ipcRenderer.invoke('fs:set-default-file-manager'),
  getLoginItemSettings: () => ipcRenderer.invoke('fs:get-login-item-settings'),
  setLoginItemSettings: (settings) => ipcRenderer.invoke('fs:set-login-item-settings', settings)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('explorerAPI', explorerAPI)
  } catch (error) {
    console.error('Failed to expose explorerAPI into context:', error)
  }
} else {
  window.explorerAPI = explorerAPI
}
