import { ErrorBoundary } from "./ErrorBoundary";

interface ErrorBoundaryLayoutProps {
  children: React.ReactNode;
}

export default function ErrorBoundaryLayout({
  children,
}: ErrorBoundaryLayoutProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
