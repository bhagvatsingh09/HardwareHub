
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const API_URL = "http://localhost:5095/api/AdminAuth/login";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          result?.message ??
            (response.status === 401
              ? "Invalid email or password, or account inactive."
              : "Unable to sign in. Please try again.")
        );
        return;
      }

      // Support common JWT response property names.
      const token =
        result?.token ??
        result?.accessToken ??
        result?.jwtToken;

      if (typeof token !== "string" || !token) {
        setError(
          "Login succeeded, but the authentication token was not found in the API response."
        );
        return;
      }

      // Store the token for subsequent authenticated API requests.
      sessionStorage.setItem("adminToken", token);

      navigate("/admin", { replace: true });
    } catch {
      setError(
        "Cannot connect to the server. Make sure the HardwareHub API is running."
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

        <p className="auth-eyebrow">OWNER PORTAL</p>
        <h1>Welcome back</h1>
        <p className="auth-description">
          Sign in to manage your shop and inventory.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="owner@example.com"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="admin-password">Password</label>

            <div className="auth-password-wrap">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="auth-notice" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-primary-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          Setting up your first account?{" "}
          <Link to="/admin/register">Initial setup</Link>
        </p>

        <Link to="/admin/access" className="auth-back-link">
          ← Back to admin portal
        </Link>
      </section>
    </main>
  );
}

export default AdminLogin;
