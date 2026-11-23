
export default function Button({
    children,
    type = "button",
    onClick,
    loading = false,
    disabled = false,
    variant = "primary",
    fullWidth = false,
    className = "",
}) {
    const variants = {
        primary:
            "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500",

        secondary:
            "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400",

        danger:
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",

        dark:
            "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500",

        outline:
            "border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500",
    };

    const selectedVariant = variants[variant] ?? variants.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-busy={loading}
            className={`
                inline-flex items-center justify-center gap-2
                rounded-lg px-5 py-3
                text-sm font-semibold
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-4
                disabled:cursor-not-allowed disabled:opacity-50
                ${selectedVariant}
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
        >
            {loading && (
                <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                />
            )}

            {loading ? "Please wait..." : children}
        </button>
    );
}
