import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Profile from "../features/profile/pages/Profile";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Workouts from "../features/workouts/pages/Workouts";
import Routines from "../features/routines/pages/Routines";
import Exercises from "../features/exercises/pages/Exercises";
import History from "../features/history/pages/History";
import { ExerciseProvider } from "../context/ExerciseContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Workout from "../features/workouts/pages/Workout";
import AppLayout from "../components/layout/AppLayout";
import "./App.css";

// Layout wrapper to persist sidebar/background across route changes
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
};

function App() {
  const { loading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Clear dashboard cache on app initialization (reload/new tab)
    // Runs ONLY ONCE per app session mount.
    try {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("dash_")) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn("Failed to clear session cache", e);
    }
  }, []);

  useEffect(() => {
    /* 
      Clean up the initial loader only after AuthContext finishes loading AND
      the critical initial route (Dashboard) signals it is ready.
      This prevents the "Sidebar first, Content later" layout shift.
    */
    const removeLoader = () => {
      const loader = document.getElementById("initial-loader");
      if (loader) {
        // Add a small delay to ensure the app is visually ready/painted
        setTimeout(() => {
          loader.classList.add("fade-out");
          // Remove from DOM after transition (0.5s) completes to clean up
          setTimeout(() => {
            loader.remove();
          }, 550);
        }, 150); 
      }
    };

    if (!loading) {
      const isDashboard = location.pathname === "/dashboard" || location.pathname === "/";

      if (isDashboard) {
        // Wait for dashboard data to be ready
        window.addEventListener("dashboard-ready", removeLoader, { once: true });
        
        // Safety fallback: ensure loader is removed even if event is missed
        const timer = setTimeout(removeLoader, 2500);
        
        return () => {
          window.removeEventListener("dashboard-ready", removeLoader);
          clearTimeout(timer);
        };
      } else {
        // For other routes, remove loader immediately as they are lighter
        removeLoader();
      }
    }
  }, [loading, location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Layout Route - Persists AppLayout across child routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App;
