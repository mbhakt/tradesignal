import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

// ── Page loading fallback ─────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="p-4 space-y-3" data-ocid="app.loading_state">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["s1", "s2", "s3", "s4"].map((k) => (
          <Skeleton key={k} className="h-24 rounded-sm" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-sm" />
    </div>
  );
}

// ── Root route with Layout ────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

// ── Child routes ──────────────────────────────────────────────────────────────
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watchlist",
  component: Watchlist,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portfolio",
  component: Portfolio,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

// ── Router ────────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  watchlistRoute,
  portfolioRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── App root ──────────────────────────────────────────────────────────────────
export default function App() {
  return <RouterProvider router={router} />;
}
