import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Global State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }, []);

  const checkActiveWorkout = useCallback(async () => {
    try {
      const res = await api.get("/workouts/active");
      if (res.data) {
        setIsWorkoutActive(true);
        setActiveWorkoutId(res.data.id);
        setWorkoutStartTime(new Date(res.data.startTime || res.data.createdAt).getTime());
      } else {
        setIsWorkoutActive(false);
        setActiveWorkoutId(null);
        setWorkoutStartTime(null);
      }
    } catch (err) {
      console.error("Failed to check active workout:", err);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    const initAuth = async () => {
      if (savedToken && savedUser) {
        setToken(savedToken);
        try {
          setUser(JSON.parse(savedUser));
          // Hydrate global state
          await Promise.allSettled([checkActiveWorkout(), fetchProfile()]);
        } catch {
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [checkActiveWorkout, fetchProfile]);

  const login = (userData, jwtToken, rememberMe = false) => {
    const safe = userData
      ? { id: userData.id, email: userData.email, name: userData.name }
      : null;
    
    setUser(safe);
    setToken(jwtToken);

    const storage = rememberMe ? localStorage : sessionStorage;

    if (safe) storage.setItem("user", JSON.stringify(safe));
    storage.setItem("token", jwtToken);
    
    // Check for active workout immediately after login
    Promise.allSettled([checkActiveWorkout(), fetchProfile()]);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsWorkoutActive(false);
    setActiveWorkoutId(null);
    setWorkoutStartTime(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      loading,
      isWorkoutActive,
      setIsWorkoutActive,
      activeWorkoutId,
      setActiveWorkoutId,
      workoutStartTime,
      setWorkoutStartTime,
      checkActiveWorkout,
      profile,
      setProfile,
      fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};