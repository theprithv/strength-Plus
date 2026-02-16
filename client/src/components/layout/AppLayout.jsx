import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-overlay" aria-hidden="true" onClick={closeSidebar} />
      <div className="sidebar-shell">
        <Sidebar onNavigate={closeSidebar} />
      </div>

      <div className="main-shell">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
        >
          <span className="sidebar-toggle-bar" />
          <span className="sidebar-toggle-bar" />
          <span className="sidebar-toggle-bar" />
        </button>
        <div className="page-shell page-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}
