/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        flow: {
          dark: '#090a10',
          panel: '#0f131d',
          panelHover: '#161c28',
          borderDark: '#1e2433',
          light: '#ffffff',
          panelLight: '#f8fafc',
          panelLightHover: '#f1f5f9',
          borderLight: '#e2e8f0',
        },
        mac: {
          bgDark: '#090a10',
          bgLight: '#ffffff',
          sidebarDark: '#0f131d',
          sidebarLight: '#f8fafc',
          panelDark: '#0b0d14',
          panelLight: '#ffffff',
          headerDark: '#121722',
          headerLight: '#ffffff',
          borderDark: '#1e2433',
          borderLight: '#e2e8f0',
          borderHoverDark: '#2d374d',
          borderHoverLight: '#cbd5e1'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'mac-window': '0 25px 65px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'mac-card': '0 4px 20px -2px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'mac-inset': 'inset 0 1px 1px 0 rgba(0, 0, 0, 0.25), 0 1px 0 0 rgba(255, 255, 255, 0.06)'
      }
    },
  },
  plugins: [],
}
