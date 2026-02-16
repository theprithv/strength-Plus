import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/new.png";
import VerificationModal from "../components/VerificationModal";
import "../assets/styles/Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });

  // Password strength logic
  useEffect(() => {
    if (!form.password) {
      setPasswordStrength({ score: 0, label: "" });
      return;
    }
    let score = 0;
    if (form.password.length >= 8) score++;
    if (/[a-z]/.test(form.password) && /[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) score++;

    const labels = ["Weak", "Fair", "Good", "Strong"];
    setPasswordStrength({ score, label: labels[score - 1] || "Weak" });
  }, [form.password]);

  // Handle Reset Token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setResetToken(token);
      setShowForgotPassword(true);
      // Clean up URL so the token isn't visible in address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/forgot-password", { email: form.email });
      setSuccess(
        "If an account exists, a reset link has been sent to your email.",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", {
        token: resetToken,
        password: form.password,
      });
      setSuccess("Password reset successfully. You can now log in.");
      setShowForgotPassword(false);
      setResetToken("");
    } catch (err) {
      const msg = err.response?.data?.errors
        ? err.response.data.errors[0].msg
        : err.response?.data?.message || "Failed to reset password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const name = [form.firstName.trim(), form.lastName.trim()]
          .filter(Boolean)
          .join(" ");
        await api.post("/auth/register", {
          email: form.email.trim(),
          password: form.password,
          name,
        });

        // Show verification modal instead of logging in
        setUnverifiedEmail(form.email.trim());
        setShowVerification(true);
      } else {
        const res = await api.post("/auth/login", {
          email: form.email.trim(),
          password: form.password,
        });
        login(res.data.user, res.data.token, form.rememberMe);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.errors
        ? err.response.data.errors[0].msg
        : err.response?.data?.message || "Authentication failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (authData) => {
    setShowVerification(false);
    login(authData.user, authData.token, form.rememberMe);
    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        const res = await api.post("/auth/google", {
          token: tokenResponse.access_token,
        });
        login(res.data.user, res.data.token, true); // Assume remember me for Google
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.response?.data?.message || "Google Login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google Login was unsuccessful"),
  });
  const VisualSection = () => (
    <div className="login-visual-section">
      <div className="visual-content">
        <div className="visual-logo">
          <img
            src={logo}
            alt="StrengthPlus logo"
            className="brand-logo-img"
          />
          <span>StrengthPlus</span>
        </div>
        <p className="visual-text">
          Train smarter, Track faster, and Grow stronger
        </p>

        <div className="visual-features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="feature-detail">
              <h3>Precision Tracking</h3>
              <p>Capture every rep, set, and workout effortlessly.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a4.5 4.5 0 0 0 0 9H13a4.5 4.5 0 0 1 0 9H5"></path>
              </svg>
            </div>
            <div className="feature-detail">
              <h3>Insightful Analytics</h3>
              <p>Know exactly how your strength evolves over time.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div className="feature-detail">
              <h3>Personalized Workouts</h3>
              <p>Workouts designed for your unique goals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-auth-section">
        <div className="login-auth-container">
          {showForgotPassword ? (
            <>
              <div className="login-header">
                <div className="login-subtitle">PASSWORD RECOVERY</div>
                <h1 className="login-title">Reset your password</h1>
                <div className="login-switch">
                  <span>Remembered your password?</span>
                  <button
                    className="login-switch-link"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Log In
                  </button>
                </div>
              </div>

              <form
                className="login-form"
                onSubmit={resetToken ? handleResetPassword : handleForgotPassword}
              >
                {!resetToken ? (
                  <div className="login-field">
                    <label>Email address</label>
                    <div className="login-input-wrap">
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="login-input"
                        placeholder="email@example.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="login-field">
                    <label>New Password</label>
                    <div className="login-input-wrap">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        className="login-input"
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="login-visible-toggle"
                        onClick={() => setShowPassword(!showPassword)}
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                    {form.password && (
                      <>
                        <div className="strength-meter">
                          <div className={`strength-bar score-${passwordStrength.score}`} />
                          <span className="strength-label">{passwordStrength.label}</span>
                        </div>
                        {passwordStrength.score < 4 && (
                          <div className="password-constraints">
                            <p>Must contain at least 8 chars, 1 uppercase, 1 number, and 1 special symbol.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {(error || success) && (
                  <div className="login-feedback-area">
                    {error && (
                      <p className="login-error">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                      </p>
                    )}
                    {success && (
                      <p className="login-success">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        {success}
                      </p>
                    )}
                  </div>
                )}

                <div className="login-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : resetToken
                        ? "Reset Password"
                        : "Send Link"}
                  </button>
                </div>
              </form>

            </>
          ) : (
            <>
              <div className="login-header">
                <div className="login-subtitle">
                  {isSignUp ? "START FOR FREE" : "WELCOME BACK"}
                </div>
                <h1 className="login-title">
                  {isSignUp ? "Create new account." : "Login to account."}
                </h1>
                <div className="login-switch">
                  <span>
                    {isSignUp ? "Already A Member?" : "Not a member yet?"}
                  </span>
                  <button
                    className="login-switch-link"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? "Log In" : "Sign Up"}
                  </button>
                </div>
              </div>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                {isSignUp && (
                  <div className="login-row">
                    <div className="login-field">
                      <label>First name</label>
                      <div className="login-input-wrap">
                        <input
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className="login-input"
                          placeholder="Michal"
                        />
                        <span className="input-icon">
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
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="login-field">
                      <label>Last name</label>
                      <div className="login-input-wrap">
                        <input
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className="login-input"
                          placeholder="Masiak"
                        />
                        <span className="input-icon">
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
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="16"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="7" y1="8" x2="17" y2="8"></line>
                            <line x1="7" y1="12" x2="17" y2="12"></line>
                            <line x1="7" y1="16" x2="12" y2="16"></line>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="login-field">
                  <label>Email</label>
                  <div className="login-input-wrap">
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="login-input"
                      placeholder="email@anywhere.co"
                      required
                      autoComplete="email"
                    />
                    <span className="input-icon">
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
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="login-field">
                  <label>Password</label>
                  <div className="login-input-wrap">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className="login-input"
                      placeholder="••••••••"
                      required
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                    />
                    <button
                      type="button"
                      className="login-visible-toggle"
                      onClick={() => setShowPassword(!showPassword)}
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                  {isSignUp && form.password && (
                    <div className="strength-meter">
                      <div
                        className={`strength-bar score-${passwordStrength.score}`}
                      />
                      <span className="strength-label">
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                {!isSignUp && (
                  <div className="login-meta">
                    <label className="remember-me">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={form.rememberMe}
                        onChange={handleChange}
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <p className="login-error">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                  </p>
                )}

                <div className="login-actions">
                  <button
                    type="button"
                    className="btn-google"
                    onClick={() => handleGoogleLogin()}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (
                      <span className="spinner" />
                    ) : isSignUp ? (
                      "Create account"
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <VisualSection />
      {showVerification && (
        <VerificationModal
          email={unverifiedEmail || form.email}
          onVerified={handleVerificationSuccess}
          onCancel={() => setShowVerification(false)}
        />
      )}
    </div>
  );
};

export default Login;
