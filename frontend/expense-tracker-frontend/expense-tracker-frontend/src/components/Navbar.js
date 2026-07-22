import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { username, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-ledger-line bg-ledger-paper/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ledger-brass/40 bg-ledger-brass/10 font-display text-lg font-semibold text-ledger-brassDark">
            ₹
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ledger-ink">
            Ledger
          </span>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <span className="hidden font-body text-sm text-ledger-inkSoft sm:inline">
              Signed in as{" "}
              <span className="font-semibold text-ledger-ink">{username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-ledger-line bg-white px-4 py-2 font-body text-sm font-medium text-ledger-ink transition-colors hover:border-ledger-coral hover:text-ledger-coral"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
