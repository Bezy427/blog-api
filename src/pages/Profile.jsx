
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";

export default function Profile() {
    const { user } = useAuth();

    const username =
        user?.username ||
        user?.name ||
        user?.email?.split("@")[0] ||
        "TechBlog User";

    const email = user?.email || "No email available";
    const role = user?.role || "USER";
    const initial = username.charAt(0).toUpperCase();

    const joinedDate = user?.createdAt
        ? formatDate(user.createdAt)
        : "Not available";

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Page heading */}
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Account
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage your account and explore your TechBlog activity.
                    </p>
                </div>

                {/* Profile hero */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-7 text-white shadow-xl sm:p-10">
                    <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[45px] border-white/5" />
                    <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-4xl font-extrabold shadow-lg backdrop-blur">
                            {initial}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="break-words text-2xl font-extrabold sm:text-3xl">
                                    {username}
                                </h2>

                                <span className="rounded-full border border-blue-200/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-100">
                                    {role}
                                </span>
                            </div>

                            <p className="mt-2 break-all text-sm text-blue-100 sm:text-base">
                                {email}
                            </p>

                            <p className="mt-4 text-sm text-blue-200">
                                Welcome to your TechBlog profile.
                            </p>
                        </div>

                        <Link
                            to="/posts"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                        >
                            Explore articles
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </section>

                {/* Dashboard content */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Account information */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    Account information
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your personal account details.
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Username
                                </p>
                                <p className="mt-2 break-words font-semibold text-slate-800">
                                    {username}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Email address
                                </p>
                                <p className="mt-2 break-all font-semibold text-slate-800">
                                    {email}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Account role
                                </p>
                                <p className="mt-2 font-semibold capitalize text-slate-800">
                                    {role.toLowerCase()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Member since
                                </p>
                                <p className="mt-2 font-semibold text-slate-800">
                                    {joinedDate}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Quick links */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-extrabold text-slate-900">
                            Quick access
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Navigate around TechBlog.
                        </p>

                        <div className="mt-6 space-y-3">
                            <Link
                                to="/posts"
                                className="group flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                                        <span>📚</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">
                                        Browse articles
                                    </span>
                                </div>
                                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                                    →
                                </span>
                            </Link>

                            <Link
                                to="/dashboard"
                                className="group flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                                        <span>📊</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">
                                        Dashboard
                                    </span>
                                </div>
                                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                                    →
                                </span>
                            </Link>

                            <Link
                                to="/"
                                className="group flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                                        <span>🏠</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">
                                        Homepage
                                    </span>
                                </div>
                                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                                    →
                                </span>
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Bottom information */}
                <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm">
                            <span className="text-xl">💡</span>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900">
                                Your TechBlog journey
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Explore technology, share your knowledge,
                                and participate in discussions with the
                                TechBlog community.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
