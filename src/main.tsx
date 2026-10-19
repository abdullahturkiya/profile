import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React App:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#060A16] text-slate-100 flex flex-col items-center justify-center p-6 text-center" dir="rtl">
          <div className="max-w-md w-full rounded-3xl border border-amber-400/30 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="h-12 w-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-400/40">
              👑
            </div>
            <h1 className="text-xl font-bold text-amber-200 mb-2">
              بوابة تركيا الفاخرة | جاري إعادة التهيئة
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              حدث تنبيه أمان بسيط في متصفحك أثناء معالجة البيانات، يمكنك الضغط على الزر أدناه لإعادة تشغيل المنصة فوراً.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full rounded-xl py-3 px-6 font-bold text-slate-950 text-xs sm:text-sm bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
            >
              إعادة تحميل المنصة وتحديث البيانات
            </button>
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
