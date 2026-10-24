import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

// Used two ways: as the catch-all "*" route (no error → 404), and as the
// router's errorElement when a page crashes while rendering.
export default function ErrorPage() {
  const error = useRouteError();
  const notFound =
    !error || (isRouteErrorResponse(error) && error.status === 404);

  if (error) console.error(error);

  return (
    <div className="min-h-screen bg-[var(--accent)] flex flex-col items-center justify-center px-6 text-center">
      <img src="/logo.png" alt="" className="w-[80px] mb-6 opacity-80" />
      <h1 className="fred-bold text-[32px] text-[var(--primary)] mb-2">
        {notFound ? "Page not found" : "Something went wrong"}
      </h1>
      <p className="fred-light text-[16px] text-gray-600 mb-8 max-w-[420px]">
        {notFound
          ? "We couldn't find the page you were looking for."
          : "An unexpected error occurred. Try reloading the page."}
      </p>
      <div className="flex gap-3">
        <Link
          to="/app/dashboard"
          className="px-5 py-2.5 rounded-[10px] bg-[var(--secondary)] text-[var(--on-secondary)] fred-bold text-[14px] hover:opacity-90 transition-opacity"
        >
          Go to dashboard
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-[10px] bg-[var(--surface)] text-[var(--primary)] fred-bold text-[14px] border border-[var(--border)] hover:border-[var(--secondary)] transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
