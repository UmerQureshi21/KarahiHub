import { Navigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { isAuthenticated, login, register } from "../services/userService";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

export default function AuthPage() {
  const location = useLocation();
  const { initializing } = useAuth();
  // UserLayout sends people here with the page they were trying to open
  const from = (location.state as { from?: Location } | null)?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : "/app/dashboard";

  const [isSignUp, setIsSignUp] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // server errors (wrong password, email taken, ...) that aren't about one field
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    setErrors({ ...errors, [name]: "" });
    setFormError(null);
  };

  // Switching tabs clears errors left over from the other form
  const switchMode = (signUp: boolean) => {
    setIsSignUp(signUp);
    setErrors({ username: "", email: "", password: "", confirmPassword: "" });
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Validation
    if (isSignUp && !formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);

    // Form is valid, proceed with authentication
    if (!Object.values(newErrors).some((error) => error)) {
      authenticate();
    }
  };

  // Signs up or in. On success userService updates AuthContext, this page re-renders,
  // and the isAuthenticated() check below redirects to where the user was headed.
  async function authenticate() {
    setSubmitting(true);
    setFormError(null);
    try {
      if (isSignUp) {
        await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });
      } else {
        await login({ email: formData.email, password: formData.password });
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : isSignUp
            ? "Registration failed"
            : "Login failed",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const handleOAuth = (provider: string) => {
    console.log(`OAuth with ${provider}`);
    alert(`${provider} OAuth integration coming soon!`);
  };

  // Already logged in (e.g. restored from the refresh cookie) — skip the form
  if (!initializing && isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Auth Form */}
      <div className="w-full md:w-[50%] bg-[var(--accent)] flex items-center justify-center px-[20px] py-[20px]">
        <div className="w-full max-w-[450px]">
          {/* Toggle Sign In/Sign Up */}
          <div className="flex gap-[10px] mb-[20px] bg-[var(--surface)] rounded-[12px] p-[6px]">
            <button
              type="button"
              aria-pressed={!isSignUp}
              onClick={() => switchMode(false)}
              className={`flex-1 py-[10px] rounded-[8px] fred-med transition-all duration-300 ${
                !isSignUp
                  ? "bg-[var(--primary)] text-[var(--surface)]"
                  : "bg-transparent text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              aria-pressed={isSignUp}
              onClick={() => switchMode(true)}
              className={`flex-1 py-[10px] rounded-[8px] fred-med transition-all duration-300 ${
                isSignUp
                  ? "bg-[var(--primary)] text-[var(--surface)]"
                  : "bg-transparent text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="fred-bold text-[28px] text-[var(--primary)] mb-[8px]">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="fred-light text-[14px] text-gray-600 mb-[20px]">
            {isSignUp
              ? "Join our community of food lovers"
              : "Sign in to access your recipes"}
          </p>

          {/* Server-side errors (wrong password, email already used, ...) */}
          {formError && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-600 fred-med text-[14px] px-4 py-3 rounded-[10px] mb-[16px]"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-[16px]">
            {/* Username - Only for Sign Up */}
            {isSignUp && (
              <Field
                label="Username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                value={formData.username}
                error={errors.username}
                onChange={handleInputChange}
              />
            )}
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={formData.email}
              error={errors.email}
              onChange={handleInputChange}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder="Enter your password"
              value={formData.password}
              error={errors.password}
              onChange={handleInputChange}
            />
            {/* Confirm Password - Only for Sign Up */}
            {isSignUp && (
              <Field
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                onChange={handleInputChange}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--primary)] text-[var(--surface)] py-[14px] rounded-[10px] fred-bold text-[16px] hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-wait"
            >
              {submitting
                ? isSignUp
                  ? "Creating account..."
                  : "Signing in..."
                : isSignUp
                  ? "Sign Up"
                  : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-[15px] my-[20px]">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="fred-light text-[14px] text-gray-500">
              Or continue with
            </span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* OAuth Button */}
          <button
            onClick={() => handleOAuth("Google")}
            className="w-full flex items-center justify-center gap-[10px] bg-[var(--surface)] border-2 border-gray-200 py-[12px] rounded-[10px] fred-med text-[14px] hover:border-[var(--primary)] transition-colors duration-200"
          >
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24">
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden md:flex w-[50%] flex-col items-center justify-center bg-[var(--surface)] p-[40px]">
        <img
          src="/logo.png"
          alt="Karahi Hub Logo"
          className="w-[250px] mb-[30px]"
        />
        <h1 className="fred-bold text-[72px] text-[var(--primary)] mb-[15px]">
          Karahi Hub
        </h1>
        <p className="fred-light text-[24px] text-gray-600 text-center max-w-[500px]">
          Preserving Pakistani flavors, one recipe at a time
        </p>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// One labelled input with its validation message underneath.
// The id/htmlFor pair lets clicking the label focus the input and screen readers announce it.
function Field({ label, name, error, ...inputProps }: FieldProps) {
  const id = `auth-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="fred-med text-[14px] text-gray-700 mb-[6px] block"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full px-[16px] py-[12px] rounded-[10px] border-2 border-gray-200 bg-white focus:border-[var(--primary)] outline-none transition-colors duration-200 fred-light"
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-[12px] fred-light mt-[4px]">
          {error}
        </p>
      )}
    </div>
  );
}
