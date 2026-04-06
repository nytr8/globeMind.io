import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuBrainCircuit } from "react-icons/lu";
import useAuth from "../hook/useAuth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  }

  return errors;
};

const Login = () => {
  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const { loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedData = {
      email: formData.email.trim(),
      password: formData.password,
    };

    const clientErrors = validateLoginForm(normalizedData);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    const res = await handleLogin(normalizedData);
    if (res.success) {
      navigate("/");
      return;
    }

    const nextFieldErrors = { ...(res.fieldErrors || {}) };
    if (
      !nextFieldErrors.password &&
      res.message === "Invalid email or password"
    ) {
      nextFieldErrors.password = "Invalid email or password";
    }

    setFieldErrors(nextFieldErrors);
    setFormError(res.message || "Unable to login");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0D14] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-slate-800/70 bg-[#0D111A]/95 shadow-[0_20px_70px_rgba(2,6,23,0.7)] lg:grid-cols-2">
          <aside className="hidden border-r border-slate-800/60 bg-[#0A0D14]/70 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <LuBrainCircuit size={20} />
                </div>
                <span className="text-xl font-bold tracking-wide text-white">
                  Globemind.io
                </span>
              </div>
              <h2 className="mt-10 text-3xl font-semibold leading-tight text-white">
                Welcome back.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Sign in to continue building your personal knowledge graph.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Intelligent memory, one place.
            </p>
          </aside>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="lg:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <LuBrainCircuit size={18} />
                </div>
                <span className="text-lg font-bold tracking-wide text-white">
                  Globemind.io
                </span>
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-bold text-white lg:mt-0">
              Login
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in with your email and password.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={`w-full rounded-xl border bg-[#131a2a] px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/40 ${
                    fieldErrors.email
                      ? "border-red-400/80"
                      : "border-slate-700/80"
                  }`}
                  placeholder="you@example.com"
                />
                {fieldErrors.email ? (
                  <p className="mt-1 text-sm text-red-300">{fieldErrors.email}</p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.password)}
                    className={`w-full rounded-xl border bg-[#131a2a] px-3 py-2.5 pr-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/40 ${
                      fieldErrors.password
                        ? "border-red-400/80"
                        : "border-slate-700/80"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-2 inline-flex items-center text-slate-500 transition hover:text-slate-300"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p className="mt-1 text-sm text-red-300">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {formError ? (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {formError}
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-center text-sm text-slate-400">
              <p>
                Not registered?{" "}
                <Link className="font-semibold text-blue-400 hover:text-blue-300" to="/register">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
