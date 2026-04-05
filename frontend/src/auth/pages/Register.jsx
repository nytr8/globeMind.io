import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../hook/useAuth";

const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateRegisterForm = ({ username, email, password }) => {
  const errors = {};

  if (!username.trim()) {
    errors.username = "Username is required";
  } else if (username.trim().length < 3 || username.trim().length > 30) {
    errors.username = "Username must be between 3 and 30 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email.trim())) {
    errors.email = "Use a valid gmail, yahoo, or outlook address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!passwordRegex.test(password)) {
    errors.password =
      "Password must include uppercase, lowercase, number, special character, and be 8+ chars";
  }

  return errors;
};

const Register = () => {
  const { handleRegister } = useAuth();
  const { loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
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
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    const clientErrors = validateRegisterForm(normalizedData);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    const res = await handleRegister(normalizedData);
    if (res.success) {
      navigate("/");
      return;
    }

    const nextFieldErrors = { ...(res.fieldErrors || {}) };
    if (
      !nextFieldErrors.email &&
      typeof res.message === "string" &&
      res.message.toLowerCase().includes("user already exists")
    ) {
      nextFieldErrors.email = "An account already exists with this email";
    }

    setFieldErrors(nextFieldErrors);
    setFormError(res.message || "Unable to register");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen flex items-center bg-neutral-800 px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 ">
        <h1 className="text-2xl font-bold text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create a new account with username, email, and password.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.username)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-slate-900 ${
                fieldErrors.username ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Choose a username"
            />
            {fieldErrors.username ? (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
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
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-slate-900 ${
                fieldErrors.email ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="you@example.com"
            />
            {fieldErrors.email ? (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
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
                className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition focus:border-slate-900 ${
                  fieldErrors.password ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 inline-flex items-center text-slate-500 transition hover:text-slate-800"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-4 w-4" />
                ) : (
                  <FaEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {formError ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}
      </div>
    </main>
  );
};

export default Register;
