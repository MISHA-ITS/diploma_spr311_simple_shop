import {FC} from "react";

type PaginationContainerProps = {
    totalCount: number;
    adsOnPage: number;
    pageNumber: number;
    onPageChange: (page: number) => void;
}

const PaginationContainer: FC<PaginationContainerProps> = ({totalCount, adsOnPage, pageNumber, onPageChange}) => {
    const totalPages = Math.ceil(totalCount / adsOnPage);

    const firstPages = [];
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
        firstPages.push(i);
    }

    const showDots = totalPages > 4;

    return (
        <div className="flex flex-row items-center gap-[30px] w-[247px] h-[35px] mx-auto mt-[49px] mb-[171px]">

            {firstPages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={
                        page === pageNumber
                            ? "flex justify-center items-center px-[12px] py-[8px] w-[31px] h-[35px] border border-[#071739] rounded-[5px]"
                            : "text-[16px] font-normal text-[#071739]"
                    }
                >
                    {page}
                </button>
            ))}

            {showDots && (
                <>
                    <span className="text-[16px] font-normal text-[#071739]">...</span>

                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={
                            totalPages === pageNumber
                                ? "flex justify-center items-center px-[12px] py-[8px] w-[31px] h-[35px] border border-[#071739] rounded-[5px]"
                                : "text-[16px] font-normal text-[#071739]"
                        }
                    >
                        {totalPages}
                    </button>
                </>
            )}
        </div>
    )
}

export default PaginationContainer;