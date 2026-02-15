import { useState, useEffect } from "react";
import api from "../../services/api";

const HighlightNote = ({ noteData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (noteData) {
      setTitle(noteData.title);
      setText(noteData.text);
    }
  }, [noteData]);

  const handleSave = async () => {
    setError("");
    if (!title.trim() || !text.trim()) {
      setError("Title and text are required.");
      return;
    }
    if (title.length > 40) {
      setError("Title must be 40 characters or less.");
      return;
    }
    if (text.length > 300) {
      setError("Text must be 300 characters or less.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/user-panel/note", { title, text });
      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    setLoading(true);
    try {
      await api.delete("/user-panel/note");
      onUpdate(null);
      setTitle("");
      setText("");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to delete note.");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing || !noteData) {
    return (
      <div className="highlight-note-card">
        <div className="right-panel-header-section" style={{ marginBottom: 0 }}>
          <h3 className="right-panel-header-label">
            Current Focus
          </h3>
          {noteData && (
            <button
              onClick={() => setIsEditing(false)}
              className="modal-close-btn"
              style={{ fontSize: '18px', padding: 0 }}
            >
              ×
            </button>
          )}
        </div>

        <div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="note-edit-input"
              maxLength={40}
            />
          </div>

          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Content area (Max 300 chars)"
              className="note-edit-textarea"
              maxLength={300}
            />
          </div>

          {error && <p className="error-text-small">{error}</p>}

          <div className="note-actions-row">
             {noteData && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="edit-icon-btn"
                title="Delete Note"
                style={{ color: '#38bdf8' }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={loading}
              className="edit-icon-btn"
              title="Save Note"
              style={{ color: '#38bdf8' }}
            >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="right-panel-header-section">
        <h3 className="right-panel-header-label">
          Current Focus
        </h3>
        <button
          onClick={() => setIsEditing(true)}
          className="note-edit-pencil-btn"
          title="Edit Note"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </div>

      <div className="highlight-note-card group">
        <h2 className="note-title-display">{noteData.title}</h2>
        <p className="note-text-display">
          {noteData.text}
        </p>
      </div>
    </>
  );
};

export default HighlightNote;
