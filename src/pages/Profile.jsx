
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
    getPosts,
    getComments,
    getMyProfile,
    updateMyProfile,
    uploadAvatar,
} from "../services/api";
import { formatDate } from "../utils/format";

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "TB";
}

function isPublished(post) {
    return String(post.status).toUpperCase() === "PUBLISHED";
}

function isDraft(post) {
    return String(post.status).toUpperCase() === "DRAFT";
}

function getPostDate(post) {
    const date = new Date(post.createdAt);
    return Number.isNaN(date.getTime()) ? null : date;
}

function getLastSixMonths(posts) {
    const now = new Date();

    const months = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(
            now.getFullYear(),
            now.getMonth() - (5 - index),
            1
        );

        return {
            key: `${date.getFullYear()}-${date.getMonth()}`,
            label: date.toLocaleDateString("en", { month: "short" }),
            count: 0,
        };
    });

    posts.filter(isPublished).forEach((post) => {
        const date = getPostDate(post);
        if (!date) return;

        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const month = months.find((item) => item.key === key);

        if (month) month.count += 1;
    });

    return months;
}

function StatCard({ title, value, description, icon, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        violet: "bg-violet-50 text-violet-600",
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
                {description}
            </p>
        </div>
    );
}

export default function Profile() {
    const { user } = useAuth();

    const fileInputRef = useRef(null);

    const [posts, setPosts] = useState([]);
    const [commentsCount, setCommentsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    // Profile state
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState("");

    // Bio editing state
    const [editingBio, setEditingBio] = useState(false);
    const [bio, setBio] = useState("");
    const [savingBio, setSavingBio] = useState(false);
    const [bioMessage, setBioMessage] = useState("");

    // Avatar state
    const [avatarPreview, setAvatarPreview] = useState("");
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarMessage, setAvatarMessage] = useState("");
    const [avatarError, setAvatarError] = useState("");

    const username =
        user?.username ||
        user?.name ||
        user?.email?.split("@")[0] ||
        "TechBlog User";

    const email = user?.email || "No email available";
    const role = user?.role || "USER";
    const initials = getInitials(username);

    const avatarUrl = avatarPreview || profile?.avatarUrl || "";

    // Load profile from backend.
    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            setProfileLoading(true);
            setProfileError("");

            try {
                const data = await getMyProfile();

                if (!cancelled) {
                    setProfile(data);
                    setBio(data?.bio || "");
                }
            } catch (err) {
                if (!cancelled) {
                    setProfileError(
                        err.message || "Unable to load your profile."
                    );
                }
            } finally {
                if (!cancelled) {
                    setProfileLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    // Load posts and comments for dashboard statistics.
    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            setLoading(true);
            setError("");

            try {
                const response = await getPosts();

                const allPosts = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.content)
                        ? response.content
                        : [];

                const authorPosts = allPosts.filter((post) => {
                    const author =
                        typeof post.author === "string"
                            ? post.author
                            : post.author?.username;

                    return author?.toLowerCase() === username.toLowerCase();
                });

                const sortedPosts = [...authorPosts].sort((a, b) => {
                    const dateA = getPostDate(a)?.getTime() || 0;
                    const dateB = getPostDate(b)?.getTime() || 0;

                    return dateB - dateA;
                });

                const commentResults = await Promise.allSettled(
                    authorPosts.map((post) => getComments(post.id))
                );

                const totalComments = commentResults.reduce(
                    (total, result) => {
                        if (result.status !== "fulfilled") return total;

                        const data = result.value;

                        return total + (
                            Array.isArray(data) ? data.length : 0
                        );
                    },
                    0
                );

                if (!cancelled) {
                    setPosts(sortedPosts);
                    setCommentsCount(totalComments);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || "Unable to load your dashboard."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, [username, reloadKey]);

    // Clean up temporary image previews.
    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const publishedPosts = posts.filter(isPublished);
    const draftPosts = posts.filter(isDraft);
    const recentPosts = posts.slice(0, 5);

    const chartData = useMemo(
        () => getLastSixMonths(posts),
        [posts]
    );

    const maxChartValue = Math.max(
        ...chartData.map((item) => item.count),
        1
    );

    function retryLoading() {
        setReloadKey((previous) => previous + 1);
    }

    function handleAvatarSelection(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        setAvatarError("");
        setAvatarMessage("");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setAvatarError("Please select a JPG, PNG, GIF or WEBP image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setAvatarError("Your image must not exceed 5 MB.");
            event.target.value = "";
            return;
        }

        const preview = URL.createObjectURL(file);

        setAvatarPreview((previous) => {
            if (previous) URL.revokeObjectURL(previous);
            return preview;
        });

        handleAvatarUpload(file);
        event.target.value = "";
    }

    async function handleAvatarUpload(file) {
        setUploadingAvatar(true);
        setAvatarError("");
        setAvatarMessage("");

        try {
            const updatedProfile = await uploadAvatar(file);

            setProfile(updatedProfile);
            setAvatarMessage("Profile picture updated successfully.");

            // Remove the temporary preview; use the saved ImageKit URL.
            setAvatarPreview("");
        } catch (err) {
            setAvatarError(
                err.message || "Unable to upload your profile picture."
            );

            // Keep the existing saved image if upload fails.
            setAvatarPreview("");
        } finally {
            setUploadingAvatar(false);
        }
    }

    async function handleSaveBio(event) {
        event.preventDefault();

        setSavingBio(true);
        setBioMessage("");
        setProfileError("");

        try {
            const updatedProfile = await updateMyProfile({ bio });

            setProfile(updatedProfile);
            setBio(updatedProfile?.bio || "");
            setEditingBio(false);
            setBioMessage("Your bio has been saved.");
        } catch (err) {
            setProfileError(
                err.message || "Unable to save your bio."
            );
        } finally {
            setSavingBio(false);
        }
    }

    function cancelBioEdit() {
        setBio(profile?.bio || "");
        setEditingBio(false);
        setProfileError("");
    }

    return (
        <main className="min-h-screen bg-[#f8f9fc] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Page heading */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                            Author workspace
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            My Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Manage your profile, articles and writing activity.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={retryLoading}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-50"
                    >
                        <span aria-hidden="true">↻</span>
                        Refresh
                    </button>
                </div>

                {/* Profile hero */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-7 text-white shadow-xl sm:p-10">
                    <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[45px] border-white/5" />

                    <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                        {/* Avatar */}
                        <div className="relative h-28 w-28 shrink-0">
                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-2 border-white/30 bg-white/10 text-4xl font-extrabold shadow-lg backdrop-blur">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={`${username}'s profile`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    initials
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingAvatar || profileLoading}
                                title="Change profile picture"
                                className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white bg-blue-600 text-lg shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {uploadingAvatar ? "…" : "📷"}
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleAvatarSelection}
                                className="hidden"
                            />
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

                            <p className="mt-2 break-all text-sm text-blue-100">
                                {email}
                            </p>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-200">
                                {profile?.bio ||
                                    "Welcome back! Add a short bio to tell the TechBlog community about yourself."}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-3">
                                {uploadingAvatar && (
                                    <span className="text-xs font-semibold text-blue-100">
                                        Uploading picture...
                                    </span>
                                )}

                                {avatarMessage && (
                                    <span role="status" className="text-xs font-semibold text-emerald-200">
                                        {avatarMessage}
                                    </span>
                                )}

                                {avatarError && (
                                    <span role="alert" className="text-xs font-semibold text-red-200">
                                        {avatarError}
                                    </span>
                                )}
                            </div>
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

                {/* Profile editor */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">
                                About me
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Tell readers a little about yourself.
                            </p>
                        </div>

                        {!editingBio && (
                            <button
                                type="button"
                                onClick={() => {
                                    setBio(profile?.bio || "");
                                    setEditingBio(true);
                                    setBioMessage("");
                                }}
                                disabled={profileLoading}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50"
                            >
                                Edit bio
                            </button>
                        )}
                    </div>

                    {profileError && (
                        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                            {profileError}
                        </p>
                    )}

                    {bioMessage && (
                        <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                            {bioMessage}
                        </p>
                    )}

                    {editingBio ? (
                        <form onSubmit={handleSaveBio} className="mt-5">
                            <label
                                htmlFor="profile-bio"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Your bio
                            </label>

                            <textarea
                                id="profile-bio"
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                                maxLength={500}
                                rows={4}
                                placeholder="I'm a developer interested in Java, Spring Boot and software engineering..."
                                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs text-slate-400">
                                    {bio.length}/500 characters
                                </span>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={cancelBioEdit}
                                        disabled={savingBio}
                                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={savingBio || bio.length > 500}
                                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {savingBio ? "Saving..." : "Save bio"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                            {profileLoading
                                ? "Loading profile..."
                                : profile?.bio || "You haven't added a bio yet."}
                        </p>
                    )}
                </section>

                {/* Dashboard error */}
                {error && (
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p role="alert" className="text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={retryLoading}
                            className="text-sm font-bold text-red-700 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Statistics */}
                <section className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-xl font-extrabold text-slate-900">
                            Writing overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your activity and publishing performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Total articles"
                            value={loading ? "—" : posts.length}
                            description="All your articles"
                            color="blue"
                            icon="📝"
                        />

                        <StatCard
                            title="Published"
                            value={loading ? "—" : publishedPosts.length}
                            description="Articles available to readers"
                            color="emerald"
                            icon="🌐"
                        />

                        <StatCard
                            title="Drafts"
                            value={loading ? "—" : draftPosts.length}
                            description="Articles still in progress"
                            color="amber"
                            icon="📄"
                        />

                        <StatCard
                            title="Comments received"
                            value={loading ? "—" : commentsCount}
                            description="Comments on your articles"
                            color="violet"
                            icon="💬"
                        />
                    </div>
                </section>

                {/* Analytics and account information */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Publishing chart */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    Publishing activity
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Published articles over the last six months.
                                </p>
                            </div>

                            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                                Last 6 months
                            </span>
                        </div>

                        {loading ? (
                            <div className="mt-8 flex h-48 items-center justify-center text-sm text-slate-400">
                                Loading analytics...
                            </div>
                        ) : (
                            <div className="mt-8">
                                <div className="flex h-48 items-end justify-around gap-3 border-b border-slate-100 pb-2">
                                    {chartData.map((item) => (
                                        <div
                                            key={item.key}
                                            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                        >
                                            <span className="text-xs font-bold text-slate-500">
                                                {item.count}
                                            </span>

                                            <div className="flex h-full w-full items-end justify-center">
                                                <div
                                                    className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-400 transition-all duration-500"
                                                    style={{
                                                        height: `${Math.max(
                                                            (item.count / maxChartValue) * 100,
                                                            item.count > 0 ? 8 : 2
                                                        )}%`,
                                                    }}
                                                    title={`${item.count} published articles`}
                                                />
                                            </div>

                                            <span className="text-xs font-semibold text-slate-400">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Account details */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    Account details
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your account information.
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <span className="text-xl">👤</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Username
                                </p>
                                <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                                    {username}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Email address
                                </p>
                                <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                                    {email}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Account role
                                </p>
                                <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
                                    {String(role).toLowerCase()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Member since
                                </p>
                                <p className="mt-2 text-sm font-semibold text-slate-800">
                                    {user?.createdAt
                                        ? formatDate(user.createdAt)
                                        : "Not available"}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Recent articles */}
                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900">
                                My articles
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your latest contributions to TechBlog.
                            </p>
                        </div>

                        <Link
                            to="/posts"
                            className="text-sm font-bold text-blue-600 transition hover:text-blue-800"
                        >
                            Browse all articles →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-sm text-slate-400">
                            Loading your articles...
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                            <div className="text-3xl">✍️</div>

                            <h3 className="mt-4 font-bold text-slate-800">
                                No articles yet
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Your articles will appear here when you publish or save them.
                            </p>

                            <Link
                                to="/posts"
                                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                            >
                                Explore TechBlog
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6 divide-y divide-slate-100">
                            {recentPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <span className="text-xl">📄</span>
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="break-words font-bold text-slate-800">
                                                {post.title}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {post.createdAt
                                                    ? formatDate(post.createdAt)
                                                    : "Date unavailable"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                                                isPublished(post)
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : isDraft(post)
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {post.status || "Unknown"}
                                        </span>

                                        <Link
                                            to={
                                                isDraft(post)
                                                    ? `/posts/${post.id}/edit`
                                                    : `/posts/${post.id}`
                                            }
                                            className="rounded-lg px-3 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                                        >
                                            {isDraft(post) ? "Edit draft" : "View article"}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Bottom information */}
                <section className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                            🚀
                        </div>

                        <div className="flex-1">
                            <h3 className="font-extrabold text-slate-900">
                                Keep creating and sharing
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Every article is an opportunity to share your knowledge,
                                connect with readers and contribute to the TechBlog community.
                            </p>
                        </div>

                        <Link
                            to="/posts"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            Explore articles
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
