import React, { useState } from 'react';
import {
  Plane,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  KeyRound
} from 'lucide-react';

/**
 * Screen 2: TravelWise Login & Sign Up Interface
 * 
 * Features:
 * - Tab switching between "Sign In" and "Create Account"
 * - Full client-side validation with inline error messages
 * - Show / Hide password toggles
 * - "Remember Me" preference checkbox
 * - "Forgot Password" interactive modal simulation
 * - 1-Click "Demo Account" instant login for testing
 * - Simulated social logins (Google, Apple)
 * - Prototype loading spinner and realistic success confirmation
 * - Functional "Back" button returning to Splash Screen
 */
export default function LoginPlaceholder({ onBack, onLoginSuccess }) {
  // Tab mode: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation & Error states
  const [errors, setErrors] = useState({});

  // Submission & Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(null); // { type, name, email }
  const [toastMessage, setToastMessage] = useState(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Helper: validate email address format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Clear single error when user modifies input
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Switch between Login and Sign Up tabs cleanly
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setAuthSuccess(null);
  };

  // --- LOGIN SUBMIT HANDLER ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginEmail.trim()) {
      newErrors.loginEmail = 'Please enter your email address.';
    } else if (!isValidEmail(loginEmail)) {
      newErrors.loginEmail = 'Please enter a valid email address (e.g., alex@example.com).';
    }

    if (!loginPassword) {
      newErrors.loginPassword = 'Please enter your password.';
    } else if (loginPassword.length < 6) {
      newErrors.loginPassword = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate network authentication request
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSuccess({
        type: 'login',
        name: loginEmail.split('@')[0],
        email: loginEmail,
        rememberMe
      });
    }, 750);
  };

  // --- SIGN UP SUBMIT HANDLER ---
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signupName.trim()) {
      newErrors.signupName = 'Please enter your full name.';
    } else if (signupName.trim().length < 2) {
      newErrors.signupName = 'Name must be at least 2 characters.';
    }

    if (!signupEmail.trim()) {
      newErrors.signupEmail = 'Please enter your email address.';
    } else if (!isValidEmail(signupEmail)) {
      newErrors.signupEmail = 'Please enter a valid email address.';
    }

    if (!signupPassword) {
      newErrors.signupPassword = 'Please create a password.';
    } else if (signupPassword.length < 6) {
      newErrors.signupPassword = 'Password must be at least 6 characters long.';
    }

    if (!signupConfirmPassword) {
      newErrors.signupConfirmPassword = 'Please confirm your password.';
    } else if (signupPassword !== signupConfirmPassword) {
      newErrors.signupConfirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must accept the Terms of Service to continue.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate account registration
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSuccess({
        type: 'signup',
        name: signupName,
        email: signupEmail
      });
    }, 850);
  };

  // --- ONE-CLICK DEMO LOGIN ---
  const handleDemoLogin = () => {
    setLoginEmail('traveler.demo@travelwise.com');
    setLoginPassword('ExploreKerala2026');
    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSuccess({
        type: 'login',
        name: 'Demo Traveler',
        email: 'traveler.demo@travelwise.com',
        rememberMe: true
      });
    }, 600);
  };

  // --- SOCIAL LOGIN SIMULATION ---
  const handleSocialLogin = (provider) => {
    setToastMessage(`Simulated ${provider} authentication successful (Prototype mode).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- FORGOT PASSWORD SUBMIT ---
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(forgotEmail)) {
      setForgotError('Please enter a valid email format.');
      return;
    }

    setForgotError('');
    setIsForgotLoading(true);

    setTimeout(() => {
      setIsForgotLoading(false);
      setForgotSent(true);
    }, 700);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotSent(false);
    setForgotError('');
    setForgotEmail('');
  };

  return (
    <div className="login-page-container">
      {/* Decorative ambient background accents */}
      <div className="login-decorative-circle one" />
      <div className="login-decorative-circle two" />

      {/* Main Authentication Card */}
      <div className="auth-card-container">
        {/* Navigation & Brand Header */}
        <div className="login-top-bar">
          <button
            id="btn-back-to-splash"
            className="btn-back"
            onClick={onBack}
            title="Return to Splash Screen"
          >
            <ArrowLeft size={16} />
            <span>Back to Splash</span>
          </button>

          <div className="login-brand-mini">
            <div className="brand-mini-icon">
              <Plane size={16} />
            </div>
            <span>TravelWise</span>
          </div>
        </div>

        {/* Prototype Notification Pill */}
        <div className="prototype-status-banner">
          <ShieldCheck size={16} className="proto-icon" />
          <span>
            <strong>Prototype Auth:</strong> Client simulation for Screen 2 testing. No database connection required.
          </span>
        </div>

        {/* Temporary Toast message */}
        {toastMessage && (
          <div className="friendly-toast info">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SUCCESS STATE CONFIRMATION CARD */}
        {authSuccess ? (
          <div className="auth-success-card">
            <div className="success-icon-badge">
              <CheckCircle2 size={36} color="#10B981" />
            </div>
            <h3 className="success-heading">
              {authSuccess.type === 'login' ? 'Signed In Successfully!' : 'Account Created Successfully!'}
            </h3>
            <p className="success-subtext">
              Welcome aboard, <strong>{authSuccess.name}</strong>! Your prototype travel session is now initialized.
            </p>

            <div className="session-info-box">
              <div className="session-item">
                <span className="session-label">Email:</span>
                <span className="session-value">{authSuccess.email}</span>
              </div>
              <div className="session-item">
                <span className="session-label">Mode:</span>
                <span className="session-value">Screen 2 Complete (Prototype Session)</span>
              </div>
              <div className="session-item">
                <span className="session-label">Next Step:</span>
                <span className="session-value">Screen 3 (Exploration Dashboard)</span>
              </div>
            </div>

            <div className="success-actions">
              <button
                id="btn-go-to-dashboard"
                className="btn-primary-action"
                onClick={() => onLoginSuccess && onLoginSuccess(authSuccess)}
              >
                Proceed to Home Dashboard
              </button>

              <button
                id="btn-test-another"
                className="btn-outline-action"
                onClick={() => {
                  setAuthSuccess(null);
                  setLoginPassword('');
                  setSignupPassword('');
                  setSignupConfirmPassword('');
                }}
              >
                Test Another Login / Sign Up
              </button>

              <button
                id="btn-return-splash"
                className="btn-outline-action"
                onClick={onBack}
              >
                Back to Splash Screen
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header / Subtitle */}
            <div className="login-header-group">
              <h2 className="login-title">
                {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="login-subtitle">
                {activeTab === 'login'
                  ? 'Sign in to access your saved itineraries, booked stays, and travel plans.'
                  : 'Join TravelWise today to discover curated trips, compare stays, and plan your journey.'}
              </p>
            </div>

            {/* TAB SELECTOR: SIGN IN / SIGN UP */}
            <div className="auth-tabs-nav" role="tablist">
              <button
                id="tab-btn-signin"
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('login')}
              >
                Sign In
              </button>
              <button
                id="tab-btn-signup"
                type="button"
                role="tab"
                aria-selected={activeTab === 'signup'}
                className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('signup')}
              >
                Create Account
              </button>
            </div>

            {/* 1-CLICK DEMO LOGIN BUTTON (Login mode only) */}
            {activeTab === 'login' && (
              <button
                id="btn-quick-demo"
                type="button"
                className="btn-demo-account"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
                title="Auto-fill demo credentials and simulate instant login"
              >
                <Sparkles size={16} />
                <span>1-Click Demo Login (Instant Test)</span>
              </button>
            )}

            {/* ---------------- LOGIN FORM ---------------- */}
            {activeTab === 'login' && (
              <form id="form-login" onSubmit={handleLoginSubmit} noValidate>
                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">
                    Email Address
                  </label>
                  <div className={`input-wrapper ${errors.loginEmail ? 'has-error' : ''}`}>
                    <Mail size={18} className="input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      className="form-input"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        clearError('loginEmail');
                      }}
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.loginEmail && (
                    <div className="field-error-message">
                      <AlertCircle size={14} />
                      <span>{errors.loginEmail}</span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">
                    Password
                  </label>
                  <div className={`input-wrapper ${errors.loginPassword ? 'has-error' : ''}`}>
                    <Lock size={18} className="input-icon" />
                    <input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        clearError('loginPassword');
                      }}
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      id="btn-toggle-login-password"
                      className="btn-password-toggle"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.loginPassword && (
                    <div className="field-error-message">
                      <AlertCircle size={14} />
                      <span>{errors.loginPassword}</span>
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="auth-options-row">
                  <label className="checkbox-container" htmlFor="checkbox-remember">
                    <input
                      id="checkbox-remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-checkmark" />
                    <span className="checkbox-label-text">Remember me</span>
                  </label>

                  <button
                    id="btn-forgot-password-link"
                    type="button"
                    className="link-forgot-password"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Sign In Button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  className="btn-login-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="spinner-icon" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            )}

            {/* ---------------- SIGN UP FORM ---------------- */}
            {activeTab === 'signup' && (
              <form id="form-signup" onSubmit={handleSignupSubmit} noValidate>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">
                    Full Name
                  </label>
                  <div className={`input-wrapper ${errors.signupName ? 'has-error' : ''}`}>
                    <User size={18} className="input-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Maya Sharma"
                      value={signupName}
                      onChange={(e) => {
                        setSignupName(e.target.value);
                        clearError('signupName');
                      }}
                      autoComplete="name"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.signupName && (
                    <div className="field-error-message">
                      <AlertCircle size={14} />
                      <span>{errors.signupName}</span>
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">
                    Email Address
                  </label>
                  <div className={`input-wrapper ${errors.signupEmail ? 'has-error' : ''}`}>
                    <Mail size={18} className="input-icon" />
                    <input
                      id="signup-email"
                      type="email"
                      className="form-input"
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        clearError('signupEmail');
                      }}
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.signupEmail && (
                    <div className="field-error-message">
                      <AlertCircle size={14} />
                      <span>{errors.signupEmail}</span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">
                    Create Password
                  </label>
                  <div className={`input-wrapper ${errors.signupPassword ? 'has-error' : ''}`}>
                    <Lock size={18} className="input-icon" />
                    <input
                      id="signup-password"
                      type={showSignupPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        clearError('signupPassword');
                      }}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      id="btn-toggle-signup-password"
                      className="btn-password-toggle"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      title={showSignupPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.signupPassword && (
                    <div className="field-error-message">
                      <AlertCircle size={14} />
                      <span>{errors.signupPassword}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-confirm-password">
                    Confirm Password
                  </label>
                  <div className={`input-wrapper ${errors.signupConfirmPassword ? 'has-error' : ''}`}>
                    <Lock size={18} className="input-icon" />
                    <input
                      id="signup-confirm-password"
                      type={showSignupConfirmPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Re-enter password"
                      value={signupConfirmPassword}
                      onChange={(e) => {
                        setSignupConfirmPassword(e.target.value);
                        clearError('signupConfirmPassword');
                      }}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      id="btn-toggle-confirm-password"
                      className="btn-password-toggle"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      title={showSignupConfirmPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showSignupConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.signupConfirmPassword && (
                    <div className="field-error-message">
                      <AlertCircle size={14} />
                      <span>{errors.signupConfirmPassword}</span>
                    </div>
                  )}
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="form-group">
                  <label className="checkbox-container" htmlFor="checkbox-terms">
                    <input
                      id="checkbox-terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        clearError('agreeTerms');
                      }}
                      disabled={isSubmitting}
                    />
                    <span className="checkbox-checkmark" />
                    <span className="checkbox-label-text">
                      I agree to the <span className="text-highlight">Terms of Service</span> and <span className="text-highlight">Privacy Policy</span>.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <div className="field-error-message">
                      <AlertCircle size={14} />
                      <span>{errors.agreeTerms}</span>
                    </div>
                  )}
                </div>

                {/* Submit Sign Up Button */}
                <button
                  id="btn-signup-submit"
                  type="submit"
                  className="btn-login-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="spinner-icon" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            )}

            {/* Social Authentication Divider */}
            <div className="auth-divider">
              <span className="divider-line" />
              <span className="divider-text">Or continue with</span>
              <span className="divider-line" />
            </div>

            {/* Social Logins */}
            <div className="social-auth-buttons">
              <button
                id="btn-social-google"
                type="button"
                className="btn-social"
                onClick={() => handleSocialLogin('Google')}
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                id="btn-social-apple"
                type="button"
                className="btn-social"
                onClick={() => handleSocialLogin('Apple')}
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.87.96-2.96-1 .04-2.15.65-2.82 1.44-.58.68-1.1 1.77-.96 2.83 1.12.09 2.18-.53 2.82-1.31z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Bottom Toggle Prompt */}
            <div className="auth-bottom-switch">
              {activeTab === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    id="link-switch-to-signup"
                    type="button"
                    className="link-switch-tab"
                    onClick={() => handleTabSwitch('signup')}
                  >
                    Create one now
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    id="link-switch-to-login"
                    type="button"
                    className="link-switch-tab"
                    onClick={() => handleTabSwitch('login')}
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* ---------------- FORGOT PASSWORD MODAL ---------------- */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={closeForgotModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-badge">
                <KeyRound size={20} color="#0866F5" />
              </div>
              <h3 className="modal-title">Reset Your Password</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={closeForgotModal}
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {forgotSent ? (
              <div className="modal-body-sent">
                <div className="success-icon-badge" style={{ margin: '0 auto 16px' }}>
                  <Check size={28} color="#10B981" />
                </div>
                <h4>Password Reset Email Sent!</h4>
                <p>
                  A simulated password recovery link was dispatched to <strong>{forgotEmail}</strong>.
                </p>
                <div className="placeholder-badge" style={{ marginTop: '12px' }}>
                  In prototype mode, no actual email is transmitted. You can now close this dialog and sign in.
                </div>
                <button
                  type="button"
                  className="btn-primary-action"
                  style={{ width: '100%', marginTop: '20px' }}
                  onClick={closeForgotModal}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} noValidate>
                <p className="modal-description">
                  Enter the email associated with your TravelWise account and we'll simulate sending a reset link.
                </p>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label" htmlFor="forgot-email-input">
                    Email Address
                  </label>
                  <div className={`input-wrapper ${forgotError ? 'has-error' : ''}`}>
                    <Mail size={18} className="input-icon" />
                    <input
                      id="forgot-email-input"
                      type="email"
                      className="form-input"
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        setForgotError('');
                      }}
                      autoFocus
                    />
                  </div>
                  {forgotError && (
                    <div className="field-error-message">
                      <AlertCircle size={14} />
                      <span>{forgotError}</span>
                    </div>
                  )}
                </div>

                <div className="modal-buttons-row">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={closeForgotModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-submit"
                    disabled={isForgotLoading}
                  >
                    {isForgotLoading ? (
                      <>
                        <Loader2 size={16} className="spinner-icon" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
