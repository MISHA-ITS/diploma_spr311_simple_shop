import {ICategoryRowProps} from "../types.ts";
import * as React from "react";
import EnvConfig from "../../../config/env.ts";

const urlCategoryImage = `${EnvConfig.API_URL}/images/categories`;

const CategoryRow: React.FC<ICategoryRowProps> = ({ category, onDeleteCategory }) => {
    return (
        <tr>
            <td className="px-5 py-4 text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">{category.id}</td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className="h-10 w-10  bg-neutral-200 dark:bg-neutral-700 overflow-hidden grid place-items-center text-sm font-medium">
                        {category.imageUrl ? (
// If you store only file names, swap to your CDN/base path below
                            <img
                                className="h-full w-full object-cover"
                                src={category.imageUrl.startsWith("http") ? category.imageUrl : `${urlCategoryImage}/50_${category.imageUrl}`}
                                alt={`${category.name}`}
                                onError={(e) => {
// graceful fallback to initials if image fails
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = "none";
                                }}
                            />
                        ) : (
                            <span>{`${category.name}`}</span>
                        )}
                    </div>
                    <div>
                        <div className="font-medium leading-tight">{`${category.name}`}</div>
                        <div className="text-xs text-neutral-500">#{String(category.id).padStart(4, "0")}</div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-2">
                <button
                    className="
                              px-3 py-1.5 rounded-xl text-xs font-medium
                              bg-red-800 text-white
                              hover:bg-red-600
                              dark:bg-red-600 dark:hover:bg-red-600

                              transition-all duration-200
                              hover:scale-105
                              active:scale-85

                              hover:ring-2 hover:ring-red-900
                              ring-offset-0 dark:ring-offset-neutral-900
                          "
                    onClick={() => onDeleteCategory(category.id)}
                >
                    Видалити
                </button>
            </td>
        </tr>
    );
};

export default CategoryRow;
