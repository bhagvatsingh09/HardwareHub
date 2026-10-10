
import { Outlet } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-shell">
      <div className={`admin-sidebar-container${menuOpen ? " mobile-open" : ""}`}>
        <AdminSidebar />
      </div>

      {menuOpen && (
        <button
          className="admin-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-icon-button admin-menu-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu size={21} />
          </button>

          <div className="admin-topbar-title">
            <span>HardwareHub</span>
            <span className="admin-topbar-divider">/</span>
            <strong>Management</strong>
          </div>

          <div className="admin-topbar-actions">
            <span className="admin-owner-label">Store Owner</span>
            <div className="admin-owner-avatar">O</div>
            <button
              className="admin-icon-button"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={19} />
            </button>
          </div>
        </header>

        <div className="admin-page-content" onClick={() => setMenuOpen(false)}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;