import { ICategoryRowProps } from "../../../types/Category/types.ts";
import * as React from "react";
import EnvConfig from "../../../config/env.ts";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

const urlCategoryImage = `${EnvConfig.API_URL}/images/`;
const noImageUrl = `${EnvConfig.API_URL}/images/noimage.jpeg`;

const CategoryRow: React.FC<ICategoryRowProps> = ({ category, onDeleteCategory, onEditCategory }) => {

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = noImageUrl;
    };

    return (
        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-100 dark:border-neutral-800">
            <td className="px-5 py-4 text-sm font-medium text-neutral-400 whitespace-nowrap w-16">
                {category.id}
            </td>

            <td className="px-4 py-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/5">
                        <img
                            className="h-full w-full object-cover"
                            src={category.imageUrl
                                ? (category.imageUrl.startsWith("http") ? category.imageUrl : `${urlCategoryImage}200_${category.imageUrl}`)
                                : noImageUrl
                            }
                            alt={category.name}
                            onError={handleImgError}
                        />
                    </div>
                    {/* Текст поруч з фото */}
                    <div className="overflow-hidden">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-100 truncate max-w-[200px]">
                            {category.name}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-4 py-2">
                <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    {category.parentName || '---'}
                </span>
            </td>

            <td className="px-4 py-2">
                <div className="text-xs text-neutral-500 italic max-w-[300px] break-words">
                    {category.childs && category.childs.length > 0
                        ? category.childs.map(x => x.name).join(' • ')
                        : <span className="text-neutral-300">немає підкатегорій</span>
                    }
                </div>
            </td>

            <td className="px-4 py-2">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEditCategory(category)}
                        title="Редагувати"
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-90 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                        <BiEdit size={18} />
                    </button>

                    <button
                        onClick={() => onDeleteCategory(category.id)}
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

export default CategoryRow;