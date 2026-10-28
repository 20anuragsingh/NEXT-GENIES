import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Uncaught application error:", error, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="container section center-text" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <div className="neu-raised card-pad" style={{ maxWidth: 480 }}>
          <h1 className="h2">Something went wrong</h1>
          <p className="muted">An unexpected error occurred. Reloading usually fixes it.</p>
          <a className="btn btn-primary" href="/">Back to home</a>
        </div>
      </main>
    );
  }
}
