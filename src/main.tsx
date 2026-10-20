import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorPayload {
  name: string;
  message: string;
  stack?: string;
  source?: string;
}

// Capture early pre-mount errors if any occur before React mounts
let preMountError: ErrorPayload | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event: ErrorEvent) => {
    if (!preMountError) {
      const err = event.error;
      preMountError = {
        name: err?.name || 'WindowError',
        message: err?.message || event.message || 'Window error occurred',
        stack: err?.stack || `${event.filename || 'unknown'}:${event.lineno || 0}:${event.colno || 0}`,
        source: 'window.onerror',
      };
    }
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    if (!preMountError) {
      const reason = event.reason;
      let name = 'UnhandledPromiseRejection';
      let message = 'Promise was rejected with no error details';
      let stack = '';

      if (reason instanceof Error) {
        name = reason.name || 'UnhandledPromiseRejection';
        message = reason.message || 'Empty error message';
        stack = reason.stack || '';
      } else if (typeof reason === 'string') {
        message = reason;
      } else if (reason && typeof reason === 'object') {
        try {
          message = JSON.stringify(reason);
        } catch {
          message = String(reason);
        }
      }

      preMountError = {
        name,
        message,
        stack,
        source: 'unhandledrejection',
      };
    }
  });
}

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: ErrorPayload;
  copied?: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: preMountError !== null,
    error: preMountError || undefined,
    copied: false,
  };

  private handleGlobalError = (event: ErrorEvent) => {
    console.error('Captured window.onerror:', event);
    const err = event.error;
    const name = err?.name || 'WindowError';
    const message = err?.message || event.message || 'Unknown window error occurred';
    const stack = err?.stack || `${event.filename || 'unknown'}:${event.lineno || 0}:${event.colno || 0}`;

    this.setState({
      hasError: true,
      error: {
        name,
        message,
        stack,
        source: 'window.onerror',
      },
    });
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Captured unhandledrejection:', event);
    const reason = event.reason;
    let name = 'UnhandledPromiseRejection';
    let message = 'Promise was rejected with no error details';
    let stack = '';

    if (reason instanceof Error) {
      name = reason.name || 'UnhandledPromiseRejection';
      message = reason.message || 'Empty error message';
      stack = reason.stack || '';
    } else if (typeof reason === 'string') {
      message = reason;
    } else if (reason && typeof reason === 'object') {
      try {
        message = JSON.stringify(reason);
      } catch {
        message = String(reason);
      }
    }

    this.setState({
      hasError: true,
      error: {
        name,
        message,
        stack,
        source: 'unhandledrejection',
      },
    });
  };

  public componentDidMount() {
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  public componentWillUnmount() {
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: {
        name: error?.name || 'ReactRenderError',
        message: error?.message || 'Unknown React error',
        stack: error?.stack || '',
        source: 'React.ErrorBoundary',
      },
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React App:', error, errorInfo);
    const combinedStack = error?.stack
      ? `${error.stack}\n${errorInfo?.componentStack || ''}`
      : errorInfo?.componentStack || '';

    this.setState({
      hasError: true,
      error: {
        name: error?.name || 'ReactRenderError',
        message: error?.message || 'Unknown React error',
        stack: combinedStack.trim(),
        source: 'React.ErrorBoundary',
      },
    });
  }

  private getStackPreview(stack?: string): string {
    if (!stack || !stack.trim()) {
      return 'No stack trace available (check iOS console or network request)';
    }
    const rawLines = stack
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    // If the first line is simply "ErrorName: ErrorMessage", skip it to get actual caller line
    let lines = rawLines;
    if (lines.length > 1 && lines[0].includes(':') && !lines[0].includes('at ') && !lines[0].includes('@')) {
      lines = lines.slice(1);
    }

    const preview = lines.slice(0, 2).join('\n');
    return preview || rawLines.slice(0, 2).join('\n');
  }

  public render() {
    if (this.state.hasError) {
      const error = this.state.error;

      return (
        <div className="min-h-screen w-full bg-[#060A16] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 text-center select-text" dir="rtl">
          <div className="max-w-lg w-full rounded-3xl border border-amber-400/30 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
            {/* Crown Icon */}
            <div className="h-12 w-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-400/40">
              👑
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-amber-200 mb-2">
              عبد الله في تركيا | جاري إعادة التهيئة
            </h1>

            {/* Subtitle */}
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              حدث تنبيه بسيط في متصفحك، يمكنك الضغط على الزر أدناه لإعادة تشغيل المنصة فوراً بكل سهولة.
            </p>

            {/* Reload Platform Yellow Button */}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full rounded-xl py-3 px-6 font-bold text-slate-950 text-xs sm:text-sm bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
            >
              إعادة تحميل المنصة
            </button>

            {/* Technical Error Diagnostic Box directly below the yellow button */}
            <div 
              dir="ltr" 
              className="mt-5 rounded-2xl border border-rose-500/40 bg-slate-950/95 p-4 text-left font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] overflow-hidden select-all"
            >
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>Technical Error Diagnostic</span>
                </div>
                {error?.source && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    {error.source}
                  </span>
                )}
              </div>

              {/* 1. Error Name & Detailed Message */}
              <div className="mb-2.5">
                <span className="text-[10px] uppercase text-slate-400 block font-semibold mb-0.5">
                  Error Message (name & message):
                </span>
                <p className="text-xs sm:text-[13px] font-bold text-rose-300 break-words leading-snug">
                  {error?.name || 'Error'}: {error?.message || 'No specific error message provided'}
                </p>
              </div>

              {/* 2. First 2 lines of Stack Trace */}
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-semibold mb-1">
                  Stack Trace (First 2 Lines):
                </span>
                <pre className="text-[11px] sm:text-xs text-rose-200/90 bg-black/70 p-2.5 rounded-lg border border-rose-900/40 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {this.getStackPreview(error?.stack)}
                </pre>
              </div>

              {/* Helper Footer for Copying from iOS */}
              <div className="mt-3 pt-2.5 border-t border-rose-500/20 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">iOS Debug Console</span>
                <button
                  type="button"
                  onClick={() => {
                    const text = `Error: ${error?.name}\nMessage: ${error?.message}\nSource: ${error?.source}\nStack:\n${error?.stack || ''}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(text).then(() => {
                        this.setState({ copied: true });
                        setTimeout(() => this.setState({ copied: false }), 2000);
                      }).catch(() => {});
                    }
                  }}
                  className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors cursor-pointer"
                >
                  {this.state.copied ? '✓ Copied' : 'Copy Error Details'}
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
