import React from "react";
import ErrorFallbackComponent from "../components/ErrorFallbackComponent";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <ErrorFallbackComponent />;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
