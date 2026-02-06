interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   page,
                                                   pageSize,
                                                   total,
                                                   onPageChange
                                               }) => {
    const totalPages = Math.ceil(total / pageSize);

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-4 text-neutral-700 dark:text-neutral-200">
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 border rounded ${
                        p === page ? "bg-gray-500" : ""
                    }`}
                >
                    {p}
                </button>
            ))}

            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                →
            </button>
        </div>
    );
};

export default Pagination;
