
import { useState } from "react";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Button from "../components/Button";

// Used by both CreatePost and EditPost.
export default function PostForm({
    initialValues,
    submitLabel,
    saving,
    error,
    onSubmit,
}) {
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [content, setContent] = useState(initialValues?.content ?? "");
    const [status, setStatus] = useState(initialValues?.status ?? "PUBLISHED");
    const [errors, setErrors] = useState({});

    function validate() {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = "Title is required.";
        } else if (title.trim().length > 255) {
            newErrors.title = "Title must be at most 255 characters.";
        }

        if (!content.trim()) {
            newErrors.content = "Content is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!validate() || saving) return;

        onSubmit({
            title: title.trim(),
            content: content.trim(),
            status,
        });
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-7">

            {/* API error */}
            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    <span className="font-bold">!</span>
                    <p>{error}</p>
                </div>
            )}

            {/* Title */}
            <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                        htmlFor="title"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Post title
                    </label>

                    <span className={`text-xs ${
                        title.length > 255 ? "text-red-600" : "text-slate-400"
                    }`}>
                        {title.length}/255
                    </span>
                </div>

                <Input
                    id="title"
                    name="title"
                    label=""
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                        setErrors((previous) => ({
                            ...previous,
                            title: "",
                        }));
                    }}
                    placeholder="Give your article a clear title"
                    required
                    error={errors.title}
                />
            </div>

            {/* Content */}
            <div>
                <div className="mb-2">
                    <label
                        htmlFor="content"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Article content
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                        Share your ideas, knowledge and experiences.
                    </p>
                </div>

                <Textarea
                    id="content"
                    name="content"
                    label=""
                    value={content}
                    onChange={(event) => {
                        setContent(event.target.value);
                        setErrors((previous) => ({
                            ...previous,
                            content: "",
                        }));
                    }}
                    placeholder="Start writing your article..."
                    rows={16}
                    required
                    error={errors.content}
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                    {content.length} characters
                </p>
            </div>

            {/* Visibility */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-slate-800"
                >
                    Publication status
                </label>

                <p className="mt-1 text-sm text-slate-500">
                    Choose whether your article should be visible to readers.
                </p>

                <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    disabled={saving}
                    className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <option value="PUBLISHED">
                        Published — everyone can read it
                    </option>
                    <option value="DRAFT">
                        Draft — only you can see it
                    </option>
                </select>
            </div>

            {/* Submit */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">
                    You can edit your article after saving.
                </p>

                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
