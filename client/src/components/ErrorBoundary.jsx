import { Component } from 'react';

class ErrorBoundary extends Component {
     constructor(props) {
    super(props);
      this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
        if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
           <div className="text-center p-8 max-w-md">
            <div className="text-5xl mb-4"></div>
           <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6 text-sm">{this.state.error?.message}</p>
              <button
              className="btn-primary"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
              </button>
          </div>
           </div>
      );
    }
        return this.props.children;
  }
}

  export default ErrorBoundary;
