
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPosts } from "../services/api";
import { formatDate } from "../utils/format";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

// -------------------------
// Helpers
// -------------------------

function getPostList(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.content)) return response.content;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.posts)) return response.posts;
    if (Array.isArray(response?.data?.content)) return response.data.content;
    return [];
}

function getAuthor(post) {
    const author = post.author ?? post.user;

    if (typeof author === "string") return author;

    return (
        author?.username ??
        author?.email ??
        post.authorUsername ??
        post.username ??
        ""
    );
}

function belongsToUser(post, user) {
    if (!user) return false;

    const author = post.author ?? post.user;

    if (
        user.id != null &&
        typeof author === "object" &&
        author?.id != null
    ) {
        return String(author.id) === String(user.id);
    }

    const authorName = getAuthor(post).toLowerCase();

    return [user.username, user.email]
        .filter(Boolean)
        .some(value => String(value).toLowerCase() === authorName);
}

function getStatus(post) {
    return String(
        post.status ??
        (post.published === true ? "PUBLISHED" : "DRAFT")
    ).toUpperCase();
}

function getInitials(user) {
    const name = user?.username || user?.email || "Writer";
    return name.charAt(0).toUpperCase();
}

function getMonthlyPosts(posts) {
    const now = new Date();

    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(
            now.getFullYear(),
            now.getMonth() - (5 - index),
            1
        );

        const monthPosts = posts.filter(post => {
            if (!post.createdAt) return false;

            const created = new Date(post.createdAt);

            return (
                created.getMonth() === date.getMonth() &&
                created.getFullYear() === date.getFullYear()
            );
        });

        return {
            label: date.toLocaleDateString("en", { month: "short" }),
            count: monthPosts.length
        };
    });
}

// -------------------------
// Reusable components
// -------------------------

function StatCard({ title, value, description, icon, color }) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </h3>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${color}`}>
                    {icon}
                </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
                {description}
            </p>
        </div>
    );
}

function SidebarLink({ to, icon, children, active = false }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
        >
            <span className="text-lg">{icon}</span>
            {children}
        </Link>
    );
}

function QuickAction({ to, icon, title, description }) {
    return (
        <Link
            to={to}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/50"
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>
            </div>

            <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                →
            </span>
        </Link>
    );
}

function PublishingChart({ data }) {
    const maximum = Math.max(...data.map(item => item.count), 1);

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Publishing activity
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Articles created over the last six months
                    </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                    Last 6 months
                </span>
            </div>

            <div className="mt-8 flex h-48 items-end justify-between gap-3 border-b border-slate-100 pb-2">
                {data.map((item, index) => (
                    <div
                        key={`${item.label}-${index}`}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                        <span className="text-xs font-semibold text-slate-600">
                            {item.count}
                        </span>

                        <div className="flex h-36 w-full items-end justify-center">
                            <div
                                className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-blue-700 to-sky-400 transition-all duration-500 hover:opacity-75"
                                style={{
                                    height: `${Math.max(
                                        (item.count / maximum) * 100,
                                        item.count > 0 ? 8 : 3
                                    )}%`
                                }}
                                title={`${item.count} articles`}
                            />
                        </div>

                        <span className="text-xs text-slate-500">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

// -------------------------
// Dashboard
// -------------------------

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");

                const response = await getPosts();

                if (!cancelled) {
                    setPosts(getPostList(response));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Unable to load your dashboard.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const myPosts = useMemo(
        () => posts.filter(post => belongsToUser(post, user)),
        [posts, user]
    );

    const publishedPosts = myPosts.filter(
        post => getStatus(post) === "PUBLISHED"
    );

    const draftPosts = myPosts.filter(
        post => getStatus(post) === "DRAFT"
    );

    const recentPosts = [...myPosts]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt ?? 0).getTime();
            const dateB = new Date(b.createdAt ?? 0).getTime();
            return dateB - dateA;
        })
        .slice(0, 5);

    const publicationRate = myPosts.length
        ? Math.round((publishedPosts.length / myPosts.length) * 100)
        : 0;

    const monthlyPosts = useMemo(
        () => getMonthlyPosts(myPosts),
        [myPosts]
    );

    const username = user?.username || user?.email || "Writer";

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    function retry() {
        setReloadKey(previous => previous + 1);
    }

    return (
        <div className="min-h-screen bg-slate-50 lg:flex">

            {/* Sidebar */}
            <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 px-5 py-7 lg:flex">
                <Link to="/" className="mb-10 flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                        T
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            TechBlog
                        </h2>
                        <p className="text-xs text-slate-400">
                            Creator workspace
                        </p>
                    </div>
                </Link>

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Workspace
                </p>

                <nav className="space-y-2">
                    <SidebarLink to="/dashboard" icon="▦" active>
                        Dashboard
                    </SidebarLink>

                    <SidebarLink to="/posts" icon="▤">
                        All articles
                    </SidebarLink>

                    <SidebarLink to="/posts/create" icon="＋">
                        Create article
                    </SidebarLink>

                    <SidebarLink to="/profile" icon="◉">
                        My profile
                    </SidebarLink>
                </nav>

                <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-sm font-semibold text-white">
                        Keep creating.
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                        Every great article starts with an idea. Share yours with the world.
                    </p>

                    <Link
                        to="/posts/create"
                        className="mt-4 block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        Write a post
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="min-w-0 flex-1">

                {/* Top navigation */}
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                TechBlog / Workspace
                            </p>
                            <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-slate-900">
                                    {username}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Creator account
                                </p>
                            </div>

                            <Link
                                to="/profile"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 ring-2 ring-blue-50"
                                title="My profile"
                            >
                                {getInitials(user)}
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile navigation */}
                    <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-5 py-3 lg:hidden">
                        <Link to="/dashboard" className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
                            Dashboard
                        </Link>
                        <Link to="/posts" className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                            Articles
                        </Link>
                        <Link to="/posts/create" className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                            Create post
                        </Link>
                        <Link to="/profile" className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                            Profile
                        </Link>
                    </nav>
                </header>

                <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8">

                    {/* Welcome banner */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 p-6 text-white shadow-xl sm:p-9">
                        <div className="relative z-10 max-w-2xl">
                            <span className="rounded-full border border-blue-300/30 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-200">
                                Your creator space
                            </span>

                            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                                Welcome back, {username}!
                            </h2>

                            <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">
                                Manage your articles, track your publishing
                                activity and share your ideas with the TechBlog
                                community.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    to="/posts/create"
                                    className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50"
                                >
                                    + Create new post
                                </Link>

                                <Link
                                    to="/posts"
                                    className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Explore articles
                                </Link>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/5" />
                        <div className="pointer-events-none absolute -bottom-36 right-36 h-72 w-72 rounded-full bg-sky-300/10 blur-3xl" />
                    </section>

                    {loading && (
                        <div className="mt-8">
                            <LoadingSpinner message="Preparing your dashboard..." />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="mt-8">
                            <ErrorMessage message={error} onRetry={retry} />
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Statistics */}
                            <section className="mt-8">
                                <div className="mb-5">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Overview
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Your content performance at a glance
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <StatCard
                                        title="Total articles"
                                        value={myPosts.length}
                                        description="Articles associated with your account"
                                        icon="▤"
                                        color="bg-blue-100 text-blue-700"
                                    />

                                    <StatCard
                                        title="Published"
                                        value={publishedPosts.length}
                                        description="Articles available to readers"
                                        icon="✓"
                                        color="bg-emerald-100 text-emerald-700"
                                    />

                                    <StatCard
                                        title="Drafts"
                                        value={draftPosts.length}
                                        description="Articles still in progress"
                                        icon="✎"
                                        color="bg-amber-100 text-amber-700"
                                    />

                                    <StatCard
                                        title="Publication rate"
                                        value={`${publicationRate}%`}
                                        description="Published articles divided by total"
                                        icon="↗"
                                        color="bg-purple-100 text-purple-700"
                                    />
                                </div>
                            </section>

                            {/* Analytics and publishing overview */}
                            <div className="mt-7 grid gap-6 xl:grid-cols-3">
                                <div className="xl:col-span-2">
                                    <PublishingChart data={monthlyPosts} />
                                </div>

                                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Publishing overview
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Your article distribution
                                    </p>

                                    <div className="mt-8 flex items-center justify-center">
                                        <div
                                            className="relative flex h-40 w-40 items-center justify-center rounded-full"
                                            style={{
                                                background: `conic-gradient(#2563eb ${publicationRate}%, #e2e8f0 ${publicationRate}% 100%)`
                                            }}
                                        >
                                            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                                                <span className="text-3xl font-bold text-slate-900">
                                                    {publicationRate}%
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    Published
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className="h-3 w-3 rounded-full bg-blue-600" />
                                                Published
                                            </div>
                                            <span className="font-bold text-slate-900">
                                                {publishedPosts.length}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className="h-3 w-3 rounded-full bg-slate-200" />
                                                Drafts
                                            </div>
                                            <span className="font-bold text-slate-900">
                                                {draftPosts.length}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
                                        Statistics are based on the articles
                                        currently returned by your API.
                                    </p>
                                </section>
                            </div>

                            {/* Recent articles and quick actions */}
                            <div className="mt-7 grid gap-6 xl:grid-cols-3">

                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                Recent articles
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Your latest published work and drafts
                                            </p>
                                        </div>

                                        <Link
                                            to="/posts"
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                        >
                                            View all →
                                        </Link>
                                    </div>

                                    {recentPosts.length === 0 ? (
                                        <div className="p-6">
                                            <EmptyState
                                                title="No articles yet"
                                                message="Create your first article and it will appear here."
                                            />

                                            <div className="mt-5 text-center">
                                                <Link
                                                    to="/posts/create"
                                                    className="inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                                                >
                                                    Write your first article
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {recentPosts.map(post => {
                                                const isDraft =
                                                    getStatus(post) === "DRAFT";

                                                return (
                                                    <div
                                                        key={post.id}
                                                        className="flex flex-wrap items-center justify-between gap-4 p-5 transition hover:bg-slate-50 sm:px-6"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <Link
                                                                to={`/posts/${post.id}`}
                                                                className="block truncate font-semibold text-slate-900 hover:text-blue-600"
                                                            >
                                                                {post.title || "Untitled article"}
                                                            </Link>

                                                            <p className="mt-2 text-xs text-slate-500">
                                                                {post.createdAt
                                                                    ? formatDate(post.createdAt)
                                                                    : "Date unavailable"}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                isDraft
                                                                    ? "bg-amber-100 text-amber-800"
                                                                    : "bg-emerald-100 text-emerald-800"
                                                            }`}>
                                                                {isDraft ? "Draft" : "Published"}
                                                            </span>

                                                            <Link
                                                                to={`/posts/${post.id}/edit`}
                                                                className="text-sm font-semibold text-slate-600 hover:text-blue-600"
                                                            >
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>

                                <aside className="space-y-6">
                                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Quick actions
                                        </h2>

                                        <div className="mt-4 space-y-3">
                                            <QuickAction
                                                to="/posts/create"
                                                icon="✎"
                                                title="Write an article"
                                                description="Share a new idea"
                                            />

                                            <QuickAction
                                                to="/profile"
                                                icon="◉"
                                                title="Edit profile"
                                                description="Update your information"
                                            />

                                            <QuickAction
                                                to="/posts"
                                                icon="▤"
                                                title="Browse articles"
                                                description="Explore the community"
                                            />
                                        </div>
                                    </section>

                                    <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
                                        <div className="text-2xl">✦</div>
                                        <h2 className="mt-3 text-lg font-bold">
                                            Keep the ideas flowing
                                        </h2>
                                        <p className="mt-2 text-sm leading-6 text-blue-100">
                                            Your next article could be the one
                                            that inspires someone.
                                        </p>
                                        <Link
                                            to="/posts/create"
                                            className="mt-5 inline-block rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                                        >
                                            Start writing →
                                        </Link>
                                    </section>
                                </aside>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
