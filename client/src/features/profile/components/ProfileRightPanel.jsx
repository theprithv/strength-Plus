import { useState, useEffect } from "react";
import api from "../../../services/api";
import HighlightNote from "./HighlightNote";
import WeeklyTodoList from "./WeeklyTodoList";

const ProfileRightPanel = () => {
  const [data, setData] = useState({ note: null, todos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user-panel");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load right panel data", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateNote = (note) => {
    setData((prev) => ({ ...prev, note }));
  };

  const handleUpdateTodos = (updateFnOrVal) => {
    // Standard React state update pattern support for children
    setData((prev) => {
        const newTodos = typeof updateFnOrVal === 'function' 
            ? updateFnOrVal(prev).todos 
            : updateFnOrVal.todos;
        return { ...prev, todos: newTodos };
    });
  };

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '14px' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="right-panel-container">
      <HighlightNote noteData={data.note} onUpdate={handleUpdateNote} />
      <WeeklyTodoList todos={data.todos} onUpdate={setData} />
    </div>
  );
};

export default ProfileRightPanel;
