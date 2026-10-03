import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0F172A",
            color: "#F1F5F9",
            padding: "24px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              padding: "40px 32px",
              background: "rgba(30, 41, 59, 0.85)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "18px",
              boxShadow: "0 18px 48px rgba(2, 8, 23, 0.35)",
            }}
          >
            <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "12px", color: "#fff" }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "24px" }}>
              We encountered an unexpected error while loading this page. Please try refreshing or return to the homepage.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
