import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Register = () => {
  const { register, authError, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirm) {
      setLocalError("Passwords don't match.");
      return;
    }
    if (password.length < 4) {
      setLocalError("Password should be at least 4 characters.");
      return;
    }

    const ok = await register(username, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="auth-card"
      >
        <div className="mb-8 text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-ledger-brass/40 bg-ledger-brass/10 font-display text-xl font-semibold text-ledger-brassDark">
            ₹
          </span>
          <h1 className="font-display text-2xl font-semibold text-ledger-ink">
            Open your ledger
          </h1>
          <p className="mt-1 font-body text-sm text-ledger-inkSoft">
            Create an account to start tracking expenses.
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-ledger-emerald/10 px-4 py-6 text-center font-body text-sm font-medium text-ledger-emerald"
          >
            Account created. Redirecting to sign in…
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
                Username
              </label>
              <input
                className="auth-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="marwan"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
                Password
              </label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-body text-xs font-medium uppercase tracking-wide text-ledger-inkSoft">
                Confirm password
              </label>
              <input
                className="auth-input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            {(localError || authError) && (
              <p className="font-body text-sm text-ledger-coral">
                {localError || authError}
              </p>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-ledger-ink py-2.5 font-body text-sm font-semibold text-ledger-paper transition hover:bg-ledger-inkSoft disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </motion.button>
          </form>
        )}

        <p className="mt-6 text-center font-body text-sm text-ledger-inkSoft">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-ledger-brassDark hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
