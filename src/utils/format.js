// Turns an ISO date from the API into something readable. Returns "" for missing or invalid dates.
export function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

// True when the user wrote the post/comment, or is an admin.
export function canManage(user, authorName) {
    return Boolean(user) && (user.role === "ADMIN" || user.username === authorName);
}
