import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.log(this.state);
  }
  render() {
    if (this.state.error) {
      return <p>Sorry, Something went wrong :( </p>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
