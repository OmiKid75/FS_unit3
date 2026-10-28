import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Drafts from "./pages/Drafts";
import ScheduledPosts from "./pages/ScheduledPosts";
import Profile from "./pages/Profile";
import RequireRole from "./components/RequireRole";
import Forbidden from "./pages/Forbidden";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const BrowsePosts = lazy(() => import("./pages/BrowsePosts"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const Settings = lazy(() => import("./pages/Settings"));

const PageFallback = () => (
  <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
    Loading…
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<RequireRole roles={["creator", "admin"]}><CreatePost /></RequireRole>} />
        <Route path="/drafts" element={<RequireRole roles={["creator", "admin"]}><Drafts /></RequireRole>} />
        <Route path="/scheduled" element={<RequireRole roles={["creator", "admin"]}><ScheduledPosts /></RequireRole>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={
             <RequireRole roles={["creator", "admin"]}>
             <Suspense fallback={<PageFallback />}><CalendarPage /></Suspense>
             </RequireRole>
              }
             />
        <Route path="/analytics" element={
             <RequireRole roles={["creator", "admin"]}>
             <Suspense fallback={<PageFallback />}><Analytics /></Suspense>
             </RequireRole>
            }
            />
        <Route path="/settings" element={
             <RequireRole roles={["creator", "admin"]}>
             <Suspense fallback={<PageFallback />}><Settings /></Suspense>
             </RequireRole>
  }
/>
        <Route path="/403" element={<Forbidden />} />
        <Route
  path="/admin"
  element={
    <RequireRole roles={["admin"]}>
      <Suspense fallback={<PageFallback />}>
        <AdminDashboard />
      </Suspense>
    </RequireRole>
  }
/>
      </Route>
      <Route path="/browse" element={<Suspense fallback={<PageFallback />}><BrowsePosts /></Suspense>} />
    </Routes>
    
  );
}

export default App;
