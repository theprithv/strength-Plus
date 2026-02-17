import { Routes, Route, Navigate } from "react-router-dom";
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

    </Routes>
  );
}

export default App;
