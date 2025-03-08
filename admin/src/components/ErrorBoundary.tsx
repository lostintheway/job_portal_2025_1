import * as React from "react";

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

const DefaultFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="">Oops! Something went wrong</h2>
          {/* <p className="text-gray-600 mb-4">
            The application has encountered an unexpected error.
          </p> */}
          {isDevelopment && error && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-left">
              <p className="font-mono text-sm text-red-500">{error.message}</p>
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {error.stack}
              </pre>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || <DefaultFallback error={this.state.error} />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
