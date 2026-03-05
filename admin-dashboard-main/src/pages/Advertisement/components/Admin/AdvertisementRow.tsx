import * as React from "react";
import EnvConfig from "../../../../config/env.ts";
import { MdDeleteOutline } from "react-icons/md";
import {IAdvertisement} from "../../types.ts";
import {Ban, CheckCircle, UserCheck} from "lucide-react";
import {useGetCategoryByIdQuery} from "../../../../services/apiCategory.ts";
import {Link} from "react-router-dom";

const urlAdImage = `${EnvConfig.API_URL}/images/advertisements/`;
const noImageUrl = `${EnvConfig.API_URL}/images/noimage.jpeg`;

interface Props {
    advertisement: IAdvertisement;
    onDelete: (id: number) => void;
    onToggleBlock: (id: number) => void;
    onApprove: (id: number) => void;
}

const AdvertisementRow: React.FC<Props> = ({ advertisement, onDelete, onToggleBlock, onApprove }) => {

    const { data: categoryData } = useGetCategoryByIdQuery(String(advertisement.categoryId));
    const categoryName = categoryData?.payload.name;

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = noImageUrl;
    };

    // Беремо перше фото з масиву (якщо масив є)
    const firstImage = advertisement.images?.[0] || advertisement.images?.[0] || null;

    const blocked = advertisement.isBlocked;
    const approved = advertisement.isApproved;
    return (
        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-100 dark:border-neutral-800">
            <td className="px-5 py-4 text-sm font-medium text-neutral-400 whitespace-nowrap w-16">
                {advertisement.id}
            </td>

            <td className="px-4 py-2">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/5">
                        <Link
                            to={`/advertisement/${advertisement.id}`}>
                            <img
                                className="h-full w-full object-cover"
                                src={firstImage
                                    ? (firstImage.startsWith("http") ? firstImage : `${urlAdImage}200_${firstImage}`)
                                    : noImageUrl
                                }
                                alt={advertisement.name}
                                onError={handleImgError}
                            />
                        </Link>
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-100 truncate max-w-[250px]" title={advertisement.name}>
                            {advertisement.name}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-4 py-2">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {advertisement.price} грн
                </span>
            </td>

            <td className="px-4 py-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {categoryName}
                </span>
            </td>

            <td className="px-4 py-2">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {advertisement.description}
                </span>
            </td>

            <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                    {/* Кнопка Підтвердження (показуємо тільки якщо ще не апрувнуто) */}
                    {!approved && !blocked && (
                        <button
                            onClick={() => onApprove(advertisement.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
                        >
                            <UserCheck size={14} /> Підтвердити
                        </button>
                    )}

                    {/* Кнопка-перемикач Блокування */}
                    <button
                        onClick={() => onToggleBlock(advertisement.id)}
                        className={`
                            px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all
                            ${blocked
                            ? "bg-green-600 hover:bg-green-500 text-white"
                            : "bg-amber-500 hover:bg-amber-400 text-white"}
                        `}
                    >
                        {blocked ? (
                            <><CheckCircle size={14} /> Активувати</>
                        ) : (
                            <><Ban size={14} /> Блокувати</>
                        )}
                    </button>

                    <button
                        onClick={() => onDelete(advertisement.id)}
                        title="Видалити"
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 active:scale-90 dark:bg-red-900/30 dark:text-red-400"
                    >
                        <MdDeleteOutline size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AdvertisementRow;