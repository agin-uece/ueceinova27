export function SkeletonGrid({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-[32px] animate-pulse border border-gray-100" />
            ))}
        </div>
    );
}