import * as React from "react";

const LazyInfiniteCanvasScene = React.lazy(() =>
  import("./scene").then((mod) => ({ default: mod.InfiniteCanvasScene }))
);

type CanvasBoundaryState = {
  hasError: boolean;
};

class CanvasErrorBoundary extends React.Component<
  React.PropsWithChildren,
  CanvasBoundaryState
> {
  state: CanvasBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error("InfiniteCanvas failed to load:", error);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "var(--color-void-teal, #0A1628)",
            color: "var(--color-phosphor-cream, #F0EDE3)",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--noesis-font-mono, monospace)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                opacity: 0.75,
                fontSize: 12,
              }}
            >
              Scene Loader Fault
            </p>
            <h2 style={{ margin: "8px 0 14px", fontWeight: 500 }}>Unable to load canvas module</h2>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                border: "1px solid rgba(240,237,227,0.35)",
                background: "transparent",
                color: "inherit",
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              Reload Scene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function InfiniteCanvas(
  props: React.ComponentProps<typeof LazyInfiniteCanvasScene>
) {
  return (
    <CanvasErrorBoundary>
      <React.Suspense fallback={null}>
        <LazyInfiniteCanvasScene {...props} />
      </React.Suspense>
    </CanvasErrorBoundary>
  );
}
