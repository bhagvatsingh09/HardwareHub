
import { Link } from "react-router-dom";
import "../styles/auth.css";
function AdminAccess() {
  return (
    <main className="admin-auth-page">
      <section className="admin-access-card">
        <Link to="/" className="auth-brand">
          Hardware<span>Hub</span>
        </Link>

        <div className="auth-icon">HH</div>

        <p className="auth-eyebrow">OWNER PORTAL</p>
        <h1>Manage your hardware business.</h1>
        <p className="auth-description">
          Access your dashboard to manage products, inventory,
          categories and customer enquiries in one place.
        </p>

        <div className="auth-access-actions">
          <Link to="/admin/login" className="auth-primary-button">
            Sign in to dashboard
          </Link>

          <Link to="/admin/register" className="auth-secondary-button">
            Initial account setup
          </Link>
        </div>

        <div className="auth-security-note">
          <span className="auth-security-dot" />
          Restricted access for authorized shop administrators
        </div>

        <Link to="/" className="auth-back-link">
          ← Back to HardwareHub
        </Link>
      </section>
    </main>
  );
}

export default AdminAccess;
