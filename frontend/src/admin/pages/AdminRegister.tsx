
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function AdminRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      setError("Please sign in with an admin account before registering another admin.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5095/api/AdminAuth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        setError("Your admin session is invalid or expired. Please sign in again.");
        return;
      }

      if (response.status === 409) {
        setError(
          result?.message ?? "An admin account with this email already exists."
        );
        return;
      }

      if (!response.ok) {
        setError(
          result?.message ?? "Registration failed. Please check your details and try again."
        );
        return;
      }

      setSuccess(
        result?.message ?? "Admin account registered successfully."
      );
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Allow the success message to be seen before returning to the dashboard.
      window.setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1200);
    } catch {
      setError(
        "Cannot connect to the HardwareHub API. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <Link to="/" className="auth-brand">
          Hardware<span>Hub</span>
        </Link>

        <p className="auth-eyebrow">ACCOUNT SETUP</p>
        <h1>Create an admin account</h1>
        <p className="auth-description">
          Add an administrator to help manage your hardware shop.
        </p>

        <div className="auth-notice">
          Registration requires an existing admin account and a valid login session.
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="admin-name">Full name</label>
            <input
              id="admin-name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              type="email"
              placeholder="owner@example.com"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <div className="auth-password-wrap">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                maxLength={100}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="auth-notice" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="auth-primary-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/admin/login">Sign in</Link>
        </p>

        <Link to="/admin/access" className="auth-back-link">
          ← Back to admin portal
        </Link>
      </section>
    </main>
  );
}

export default AdminRegister;
  