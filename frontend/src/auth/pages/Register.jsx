import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../hook/useAuth";

const Register = () => {
  const { handleRegister } = useAuth();
  const { loading, error, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await handleRegister(formData);
    if (res.success) {
      navigate("/");
    }
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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              required
              minLength={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-900"
              placeholder="Choose a username"
            />
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
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-900"
              placeholder="you@example.com"
            />
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
                required
                minLength={8}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-slate-900"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
};

export default Register;
