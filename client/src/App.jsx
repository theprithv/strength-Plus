import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Routines from "./pages/Routines";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import Workout from "./pages/Workout";
import AppLayout from "./layouts/AppLayout";
import "./assets/styles/App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/workout"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Workout />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Workouts />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/routines"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routines />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Exercises />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <History />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
