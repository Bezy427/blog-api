export default function LoadingSpinner({ message = "Loading..."}) {
    return (
        <div className="flex min-h-[20vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                <p className="text-sm text-gray-500">
                    {message}    
                </p>    
            </div>
        </div>
    )
}