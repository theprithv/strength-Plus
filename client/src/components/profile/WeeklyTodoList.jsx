import { useState, useMemo } from "react";
import api from "../../services/api";

const MAX_ITEMS_PER_DAY = 10;

const WeeklyTodoList = ({ todos, onUpdate }) => {
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Group todos by date string (YYYY-MM-DD)
  const groupedTodos = useMemo(() => {
    const groups = {};
    const today = new Date();
    
    // Initialize last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
      
      groups[dateKey] = {
        date: d,
        items: [],
      };
    }

    // Populate with actual todos
    todos.forEach((todo) => {
      const dateKey = new Date(todo.date).toISOString().split("T")[0];
      if (groups[dateKey]) {
        groups[dateKey].items.push(todo);
      }
    });

    return Object.values(groups);
  }, [todos]);

  const handleAdd = async (dateKey) => {
    if (!newItem.trim()) return;
    setError("");

    // Check limit
    const dayGroup = groupedTodos.find(g => g.date.toISOString().split("T")[0] === dateKey);
    if (dayGroup && dayGroup.items.length >= MAX_ITEMS_PER_DAY) {
      setError("Max 10 items allowed per day.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/user-panel/todos", {
        text: newItem,
        date: dateKey, // backend expects YYYY-MM-DD or ISO
      });
      onUpdate((prev) => ({ ...prev, todos: [res.data, ...prev.todos] }));
      setNewItem("");
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    // Optimistic update
    const updatedTodos = todos.map(t => 
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    onUpdate(prev => ({ ...prev, todos: updatedTodos }));

    try {
      await api.patch(`/user-panel/todos/${id}`);
    } catch (err) {
      console.error(err);
      // Revert on failure
      const reverted = todos.map(t => 
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      );
      onUpdate(prev => ({ ...prev, todos: reverted }));
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Remove this item?")) return;
    
    // Optimistic update
    const updatedTodos = todos.filter(t => t.id !== id);
    onUpdate(prev => ({ ...prev, todos: updatedTodos }));

    try {
        await api.delete(`/user-panel/todos/${id}`);
    } catch (err) {
        console.error(err);
        // Revert (refetch would be safer but complex, simpler to alert)
        alert("Failed to delete item");
    }
  };

  // Only allow adding to TODAY
  const todayKey = new Date().toISOString().split("T")[0];

  // Filter groups: Show if has items OR is Today
  const displayedGroups = groupedTodos.filter(group => {
      const dateKey = group.date.toISOString().split("T")[0];
      return dateKey === todayKey || group.items.length > 0;
  });

  return (
    <div className="weekly-todo-root">
      <div className="right-panel-divider"></div>
      <div className="right-panel-header-section">
        <h3 className="right-panel-header-label">
          Weekly Tasks
        </h3>
      </div>

      <div className="todo-scroll-area">
        {displayedGroups.map((group) => {
          const dateKey = group.date.toISOString().split("T")[0];
          const isToday = dateKey === todayKey;
          const dateLabel = group.date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
          
          return (
            <div key={dateKey} style={{ marginBottom: '24px' }}>
               <div className="weekly-todo-header-group">
                  <span className={isToday ? "todo-date-highlight" : "todo-date-muted"}>
                      {isToday ? "Today" : dateLabel}
                  </span>
                  <div className="todo-divider-line"></div>
               </div>

               <div className="todo-list-stack">
                  {group.items.length === 0 ? (
                      isToday ? (
                           <p style={{ fontSize: '13px', color: '#4b5563', fontStyle: 'italic', paddingLeft: '4px' }}>
                              Add your first task for today...
                          </p>
                      ) : null
                  ) : (
                      group.items.map(todo => (
                          <div key={todo.id} className="todo-item-row group">
                              <div className="todo-checkbox-wrapper">
                                  <button 
                                      onClick={() => handleToggle(todo.id)}
                                      className={`todo-checkbox-btn ${todo.isCompleted ? 'completed' : ''}`}
                                      title={todo.isCompleted ? "Mark incomplete" : "Mark complete"}
                                  >
                                      {todo.isCompleted ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                      ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <circle cx="12" cy="12" r="10"></circle>
                                        </svg>
                                      )}
                                  </button>
                                  <span className={`todo-text ${todo.isCompleted ? 'completed' : ''}`}>
                                      {todo.text}
                                  </span>
                              </div>
                              <button 
                                  onClick={() => handleDelete(todo.id)}
                                  className="todo-del-btn"
                                  title="Delete task"
                              >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                              </button>
                          </div>
                      ))
                  )}
               </div>

               {/* Add Input (Only for Today) */}
               {isToday && group.items.length < MAX_ITEMS_PER_DAY && (
                   <div className="todo-add-row">
                       <input 
                           type="text"
                           value={newItem}
                           onChange={(e) => setNewItem(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleAdd(dateKey)}
                           placeholder="New task..."
                           className="todo-add-input"
                       />
                       <button
                    onClick={() => handleAdd(dateKey)}
                    disabled={loading || !newItem.trim()}
                    className="todo-add-btn"
                    title="Add Task"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                   </div>
               )}
               {isToday && error && <p className="error-text-small">{error}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyTodoList;
