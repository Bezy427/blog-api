
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostForm from "./PostForm";
import { createPost } from "../services/api";

export default function CreatePost() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(values) {
        setSaving(true);
        setError("");

        try {
            const post = await createPost(values);
            navigate(`/posts/${post.id}`);
        } catch (err) {
            setError(err.message || "Could not create the post.");
            setSaving(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f8f9fc] px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-5xl">

                {/* Back navigation */}
                <Link
                    to="/posts"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                >
                    <span aria-hidden="true">←</span>
                    Back to articles
                </Link>

                {/* Page heading */}
                <div className="mb-8 mt-7">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                        Publishing workspace
                    </span>

                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Create an article
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                        Share your knowledge, ideas and experiences with
                        the TechBlog community.
                    </p>
                </div>

                {/* Editor */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 to-blue-950 px-6 py-6 text-white sm:px-9">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                            New article
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Your next great idea starts here.
                        </h2>

                        <p className="mt-2 text-sm text-slate-300">
                            Give your article a meaningful title and make
                            your content worth reading.
                        </p>
                    </div>

                    <div className="p-5 sm:p-9">
                        <PostForm
                            submitLabel="Publish article"
                            saving={saving}
                            error={error}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </section>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Make it informative. Make it meaningful. Make it yours.
                </p>
            </div>
        </main>
    );
}
