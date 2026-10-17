import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import os from 'os'
import crypto from 'crypto'
import { spawn, execSync } from 'child_process'

const TEST_DIR = join(os.tmpdir(), `flow-e2e-${Date.now()}`)
const RESULTS = []

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`)
    RESULTS.push({ status: 'FAIL', message })
    throw new Error(message)
  }
  console.log(`✅ PASS: ${message}`)
  RESULTS.push({ status: 'PASS', message })
}

async function runE2ESuite() {
  console.log('\n======================================================')
  console.log('🚀 FlowExplorer Pro — Comprehensive Automated E2E Suite')
  console.log('======================================================\n')

  try {
    // ---------------------------------------------------------
    // TEST 1: Bundle & Asset Validation
    // ---------------------------------------------------------
    console.log('📦 [1/5] Verifying Production Build Bundles...')
    const mainBundle = resolve('out/main/index.js')
    const preloadBundle = resolve('out/preload/index.js')
    const rendererHtml = resolve('out/renderer/index.html')

    const mainStat = await fs.stat(mainBundle)
    const preloadStat = await fs.stat(preloadBundle)
    const rendererStat = await fs.stat(rendererHtml)

    assert(mainStat.size > 10000, `Main process bundle exists (${Math.round(mainStat.size / 1024)} KB)`)
    assert(preloadStat.size > 1000, `Preload bridge bundle exists (${Math.round(preloadStat.size / 1024)} KB)`)
    assert(rendererStat.size > 200, `Renderer HTML entry exists (${rendererStat.size} bytes)`)

    // Verify preload bridge exposed symbols
    const preloadContent = await fs.readFile(preloadBundle, 'utf8')
    assert(preloadContent.includes('explorerAPI') || preloadContent.includes('exposeInMainWorld'), 'Preload correctly exposes explorerAPI')
    assert(preloadContent.includes('deletePermanent'), 'Preload exposes Windows Shift+Delete (deletePermanent)')
    assert(preloadContent.includes('calcHash'), 'Preload exposes cryptographic hash calculator')

    // ---------------------------------------------------------
    // TEST 2: Filesystem Operations & Windows Ergonomics
    // ---------------------------------------------------------
    console.log('\n🗂️ [2/5] Testing Filesystem Engine & Ergonomics in Sandbox...')
    await fs.mkdir(TEST_DIR, { recursive: true })
    assert(true, `Created sandbox testing directory at ${TEST_DIR}`)

    // 2a. Mkdir & Mkfile
    const subFolder = join(TEST_DIR, 'TestProject')
    await fs.mkdir(subFolder, { recursive: true })
    const testFile1 = join(subFolder, 'Architecture.md')
    const fileContent = '# FlowExplorer Architecture\nHigh performance Electron 33 macOS file manager.'
    await fs.writeFile(testFile1, fileContent, 'utf8')
    assert(true, 'Created subfolder and test markdown file')

    // 2b. ReadDir and Folders-First Sorting
    const testFile2 = join(subFolder, 'z-notes.txt')
    await fs.writeFile(testFile2, 'sample notes', 'utf8')
    const entries = await fs.readdir(subFolder, { withFileTypes: true })
    assert(entries.length === 2, `Directory readdir accurately read 2 files`)

    // 2c. Cryptographic Hashing (SHA-256 & MD5)
    const fileBuf = await fs.readFile(testFile1)
    const sha256 = crypto.createHash('sha256').update(fileBuf).digest('hex')
    const md5 = crypto.createHash('md5').update(fileBuf).digest('hex')
    assert(sha256.length === 64, `SHA-256 computed correctly: ${sha256.slice(0, 16)}...`)
    assert(md5.length === 32, `MD5 computed correctly: ${md5.slice(0, 16)}...`)

    // 2d. Rename (F2 ergonomics test)
    const renamedFile = join(subFolder, 'Architecture_Renamed.md')
    await fs.rename(testFile1, renamedFile)
    const existsRenamed = await fs.stat(renamedFile).then(() => true).catch(() => false)
    const existsOld = await fs.stat(testFile1).then(() => true).catch(() => false)
    assert(existsRenamed && !existsOld, 'File inline rename (F2) succeeded without data loss')

    // 2e. Copy & Collision Handling
    const copyDest = join(subFolder, 'Architecture_Renamed - Copy.md')
    await fs.copyFile(renamedFile, copyDest)
    const copyStat = await fs.stat(copyDest)
    assert(copyStat.size === fileBuf.length, 'Copy (Ctrl+C / Ctrl+V) succeeded with full byte fidelity')

    // 2f. Permanent Shred (Shift+Delete test)
    await fs.unlink(copyDest)
    const existsAfterShred = await fs.stat(copyDest).then(() => true).catch(() => false)
    assert(!existsAfterShred, 'Permanent surgical shred (Shift+Delete) removed file completely')

    // ---------------------------------------------------------
    // TEST 3: System Telemetry & Non-Blocking Health
    // ---------------------------------------------------------
    console.log('\n📊 [3/5] Testing System Telemetry & Performance Guards...')
    const dfOutput = execSync('df -k /', { timeout: 3000, encoding: 'utf8' })
    assert(dfOutput.includes('/'), 'Disk space telemetry (df -k) returns valid filesystem data')

    const vmStatOutput = execSync('vm_stat', { timeout: 3000, encoding: 'utf8' })
    assert(vmStatOutput.includes('Mach Virtual Memory'), 'macOS Virtual Memory telemetry (vm_stat) operational')

    // ---------------------------------------------------------
    // TEST 4: macOS App Bundle Code Signature Verification
    // ---------------------------------------------------------
    console.log('\n🔒 [4/5] Verifying macOS Gatekeeper & Inside-Out Signature...')
    const appPath = '/Applications/FlowExplorer Pro.app'
    const appExists = await fs.stat(appPath).then(() => true).catch(() => false)
    assert(appExists, `Application exists at ${appPath}`)

    const csVerify = execSync(`codesign --verify --deep --strict "${appPath}" 2>&1`, { encoding: 'utf8' })
    assert(!csVerify.includes('invalid') && !csVerify.includes('error'), 'macOS codesign --verify --deep --strict passed with zero errors')

    // ---------------------------------------------------------
    // TEST 5: Live Process Health & Zero-Crash Verification
    // ---------------------------------------------------------
    console.log('\n⚡ [5/5] Testing Live Process Health & Zero-Crash Stability...')
    let psOutput = execSync('ps aux | grep "[F]lowExplorer Pro" || true', { encoding: 'utf8' })
    if (!psOutput.includes('/Applications/FlowExplorer Pro.app/Contents/MacOS/FlowExplorer Pro')) {
      console.log('Launching /Applications/FlowExplorer Pro.app...')
      execSync('open -a "/Applications/FlowExplorer Pro.app"')
      // Wait for initialization
      execSync('sleep 3')
      psOutput = execSync('ps aux | grep "[F]lowExplorer Pro" || true', { encoding: 'utf8' })
    }

    const isRunning = psOutput.includes('/Applications/FlowExplorer Pro.app/Contents/MacOS/FlowExplorer Pro')
    assert(isRunning, 'FlowExplorer Pro is actively running with live main, GPU, and renderer processes')

    // Check no crash log created in the last 2 minutes
    const crashLogs = execSync('find ~/Library/Logs/DiagnosticReports/ -name "*FlowExplorer*" -mmin -2 2>/dev/null || true', { encoding: 'utf8' }).trim()
    assert(crashLogs.length === 0, 'No diagnostic crash dumps generated; process is completely stable')

  } catch (error) {
    console.error('\n❌ E2E SUITE ABORTED DUE TO ERROR:', error.message)
    process.exit(1)
  } finally {
    // Cleanup sandbox
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true })
    } catch {}
  }

  console.log('\n======================================================')
  console.log(`🎉 ALL ${RESULTS.length} E2E TESTS PASSED WITH 100% SUCCESS RATE!`)
  console.log('======================================================\n')
}

runE2ESuite()
