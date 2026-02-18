import { useState, useEffect, useContext } from "react";
import api from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
import HighlightNote from "./HighlightNote";
import WeeklyTodoList from "./WeeklyTodoList";

const ProfileRightPanel = () => {
  const { user } = useContext(AuthContext);
  const cacheKey = `prof_${user?.id || "anon"}_right_panel`;
  
  // Helper to get cached data
  const getCachedData = () => {
    if (!user?.id) return null;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  };

  const [data, setData] = useState({ note: null, todos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Synchronize state when user or cache changes initially
  useEffect(() => {
    const cached = getCachedData();
    if (cached) {
      setData(cached);
      setLoading(false);
    } else {
      setData({ note: null, todos: [] });
      setLoading(true);
    }
    // We trigger a fetch in the next effect based on refreshKey or missing cache
    setRefreshKey(p => p + 1);
  }, [user?.id]);

  const fetchData = async (force = false) => {
    if (!user?.id) return;

    // If not forcing and we have data, skip fetch
    if (!force && getCachedData()) {
      setLoading(false);
      return;
    }

    try {
      if (!getCachedData()) setLoading(true); // Only show loading if empty
      const res = await api.get("/user-panel");
      setData(res.data);
      sessionStorage.setItem(cacheKey, JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to load right panel data", err);
      // Only show error if we have NO data at all
      if (!data.note && (data.todos?.length || 0) === 0) {
        setError("Failed to load data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(refreshKey > 0);
  }, [refreshKey, user?.id]);

  // Global mutation listener
  useEffect(() => {
    const handleMutation = () => {
      if (user?.id) {
        sessionStorage.removeItem(cacheKey);
      }
      setRefreshKey(p => p + 1);
    };
    window.addEventListener("api-mutation-success", handleMutation);
    return () => window.removeEventListener("api-mutation-success", handleMutation);
  }, [user?.id, cacheKey]);

  const handleUpdateNote = (note) => {
    setData((prev) => {
      const next = { ...prev, note };
      if (user?.id) sessionStorage.setItem(cacheKey, JSON.stringify(next));
      return next;
    });
  };

  const handleUpdateTodos = (updateFnOrVal) => {
    setData((prev) => {
      const newTodos = typeof updateFnOrVal === 'function' 
          ? (typeof updateFnOrVal(prev).todos !== 'undefined' ? updateFnOrVal(prev).todos : updateFnOrVal(prev))
          : updateFnOrVal.todos;
      const next = { ...prev, todos: Array.isArray(newTodos) ? newTodos : prev.todos };
      if (user?.id) sessionStorage.setItem(cacheKey, JSON.stringify(next));
      return next;
    });
  };

  if (loading && !data.note && (data.todos?.length || 0) === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
      </div>
    );
  }

  if (error && !data.note && (data.todos?.length || 0) === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '14px' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="right-panel-container">
      <HighlightNote noteData={data.note} onUpdate={handleUpdateNote} />
      <WeeklyTodoList todos={data.todos || []} onUpdate={handleUpdateTodos} />
    </div>
  );
};

export default ProfileRightPanel;

