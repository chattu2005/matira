import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[MATIRA ErrorBoundary] Uncaught runtime error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 text-[#142A21] font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E7E2D9] shadow-xl text-center">
            <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#B91C1C]">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-xl font-bold text-[#142A21] mb-2">
              Something went wrong
            </h1>
            
            <p className="text-sm text-[#57534E] mb-6 leading-relaxed">
              MATIRA encountered an unexpected issue while loading the application.
              Refreshing or returning to the homepage usually resolves this.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 bg-[#1A362B] hover:bg-[#142A21] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                id="error-reload-btn"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = window.location.origin + window.location.pathname;
                }}
                className="w-full py-3 px-4 bg-[#F2ECE1] hover:bg-[#E7DFC6] text-[#1A362B] font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                id="error-home-btn"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="mt-6 text-left text-xs bg-[#FAF8F5] p-3 rounded-lg border border-[#E7E2D9] text-[#78716C] overflow-auto max-h-36">
                <summary className="cursor-pointer font-medium text-[#1A362B] mb-1">
                  Debug Details
                </summary>
                <pre className="whitespace-pre-wrap font-mono text-[11px] text-[#B91C1C]">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
