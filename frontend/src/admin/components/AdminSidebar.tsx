
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Boxes,
  MessageSquare,
  ArrowLeft,
  Store,
} from "lucide-react";

const links = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: FolderOpen },
  { label: "Inventory", path: "/admin/inventory", icon: Boxes },
  { label: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
];

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon">
          <Store size={23} />
        </div>
        <div>
          <h2>HardwareHub</h2>
          <span>OWNER PANEL</span>
        </div>
      </div>

      <p className="admin-nav-label">WORKSPACE</p>

      <nav className="admin-nav">
        {links.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? " active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <NavLink to="/" className="admin-back-link">
          <ArrowLeft size={18} />
          <span>Back to Website</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default AdminSidebar;