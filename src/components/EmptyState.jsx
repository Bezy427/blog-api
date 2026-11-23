export default function EmptyState({
    title = "Nothing here yet",
    message = "There is nothing to display.",
}) {
    return (
        <div className="rounded-xl border bg-gray-50 p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
                {title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                {message}
            </p>
        </div>
    );
}