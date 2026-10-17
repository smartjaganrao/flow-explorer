import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[FlowExplorer Runtime Error]', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0b0f19] text-white p-8 select-none">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xl">
              ⚠️
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">FlowExplorer Pro Recovery</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                A UI component encountered an unexpected error. Your files and filesystem operations remain completely safe.
              </p>
            </div>
            {this.state.error && (
              <pre className="w-full p-3 rounded-lg bg-black/40 text-rose-300 font-mono text-[11px] overflow-auto max-h-32 text-left border border-white/5">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Reload Explorer
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
