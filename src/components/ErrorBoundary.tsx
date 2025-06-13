import React, { Component, ErrorInfo, ReactNode } from 'react';

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

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                出错了
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                抱歉，应用程序遇到了一个错误
              </p>
            </div>
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  错误详情
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>{this.state.error?.message}</p>
                </div>
                {this.state.errorInfo && (
                  <div className="mt-4">
                    <details className="text-sm text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-700">
                        查看堆栈跟踪
                      </summary>
                      <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  </div>
                )}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    刷新页面
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 