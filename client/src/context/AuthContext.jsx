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
    // Avoid redundant fetches if profile is already loaded
    if (profile) return;
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }, [profile]); // Depend on profile state

  const checkActiveWorkout = useCallback(async () => {
    try {
      const res = await api.get("/workouts/active");
      if (res.data) {
        setIsWorkoutActive(true);
        setActiveWorkoutId(res.data.id);
        
        // Sync timer with server duration to avoid clock drift issues
        if (res.data.elapsedSeconds !== undefined) {
          setWorkoutStartTime(Date.now() - (res.data.elapsedSeconds * 1000));
        } else {
          // Fallback
          setWorkoutStartTime(new Date(res.data.startTime || res.data.createdAt).getTime());
        }
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
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        try {
          setUser(JSON.parse(savedUser));
          
          // These calls might fail with 401 if token is expired
          // We can't use the global interceptor reload here easily because we are mounting.
          await Promise.all([
             api.get("/workouts/active").then(res => {
               if (res.data) {
                 setIsWorkoutActive(true);
                 setActiveWorkoutId(res.data.id);
                 if (res.data.elapsedSeconds !== undefined) {
                   setWorkoutStartTime(Date.now() - (res.data.elapsedSeconds * 1000));
                 } else {
                   setWorkoutStartTime(new Date(res.data.startTime || res.data.createdAt).getTime());
                 }
               }
             }),
             api.get("/profile").then(res => setProfile(res.data))
          ]);

        } catch (e) {
          console.error("Auth Init Error (Token likely expired):", e);
          // Silent logout on init error
          setToken(null);
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []); // Run once on mount

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