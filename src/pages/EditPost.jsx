import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "./PostForm";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getPost, updatePost } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { canManage } from "../utils/format";

// key={id} gives every post its own state, so nothing from the previous post is kept.
export default function EditPost() {
    const { id } = useParams();
    return <EditPostContent key={id} id={id} />;
}

function EditPostContent({ id }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getPost(id);
                if (!cancelled) setPost(data);
            } catch (err) {
                if (!cancelled) {
                    setLoadError(err.status === 404 ? "This post does not exist." : err.message);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleSubmit(values) {
        setSaving(true);
        setSaveError("");

        try {
            await updatePost(id, values);
            navigate(`/posts/${id}`);
        } catch (err) {
            setSaveError(err.message || "Could not save the post.");
            setSaving(false);
        }
    }

    if (loading) return <LoadingSpinner message="Loading post..." />;
    if (loadError) return <ErrorMessage message={loadError} />;

    if (!canManage(user, post.author)) {
        return <ErrorMessage message="You can only edit your own posts." />;
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">Edit post</h1>

            <PostForm
                initialValues={post}
                submitLabel="Save changes"
                saving={saving}
                error={saveError}
                onSubmit={handleSubmit}
            />
        </main>
    );
}
