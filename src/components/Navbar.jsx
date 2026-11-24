
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const isLoggedIn = Boolean(user);

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const closeMenu = () => setMenuOpen(false);

    const navLinkClass = ({ isActive }) =>
        `text-sm font-semibold transition ${
            isActive
                ? "text-blue-600"
                : "text-slate-600 hover:text-blue-600"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-extrabold text-white">
                        T
                    </div>

                    <div>
                        <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                            Tech<span className="text-blue-600">Blog</span>
                        </span>

                        <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                            Ideas & Innovation
                        </span>
                    </div>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    <NavLink to="/" end className={navLinkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/posts" className={navLinkClass}>
                        Articles
                    </NavLink>

                    {isLoggedIn && (
                        <NavLink to="/dashboard" className={navLinkClass}>
                            Dashboard
                        </NavLink>
                    )}

                    <div className="ml-3 flex items-center gap-3">
                        {loading ? (
                            <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-100" />
                        ) : isLoggedIn ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    My Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden"
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? (
                        <span className="text-2xl">×</span>
                    ) : (
                        <span className="text-xl">☰</span>
                    )}
                </button>
            </nav>

            {/* Mobile navigation */}
            {menuOpen && (
                <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg md:hidden">
                    <div className="flex flex-col gap-5">
                        <NavLink
                            to="/"
                            end
                            onClick={closeMenu}
                            className={navLinkClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/posts"
                            onClick={closeMenu}
                            className={navLinkClass}
                        >
                            Articles
                        </NavLink>

                        {loading ? (
                            <p className="text-sm text-slate-400">
                                Checking session...
                            </p>
                        ) : isLoggedIn ? (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    onClick={closeMenu}
                                    className={navLinkClass}
                                >
                                    Dashboard
                                </NavLink>

                                <Link
                                    to="/profile"
                                    onClick={closeMenu}
                                    className="text-sm font-semibold text-slate-600"
                                >
                                    My Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full rounded-lg bg-red-600 px-4 py-3 text-left text-sm font-semibold text-white"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3 border-t border-slate-100 pt-4">
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
