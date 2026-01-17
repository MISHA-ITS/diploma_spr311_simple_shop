import {ICategoryRowProps} from "../../../types/Category/types.ts";
import * as React from "react";
import EnvConfig from "../../../config/env.ts";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

const urlCategoryImage = `${EnvConfig.API_URL}/images/`;

const CategoryRow: React.FC<ICategoryRowProps> = ({ category, onDeleteCategory, onEditCategory }) => {
    return (
        <tr>
            <td className="px-5 py-4 text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">{category.id}</td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className="h-10 w-10  bg-neutral-200 dark:bg-neutral-700 overflow-hidden grid place-items-center text-sm font-medium">
                        {category.imageUrl ? (
                            <img
                                className="h-full w-full object-cover"
                                src={category.imageUrl.startsWith("http") ? category.imageUrl : `${urlCategoryImage}50_${category.imageUrl}`}
                            />
                        ) : (
                            <img
                                className="h-full w-full object-cover"
                                src={`${EnvConfig.API_URL}/images/noimage.jpeg`}
                            />
                        )}
                    </div>
                    <div>
                        <div className="font-medium leading-tight">{`${category.name}`}</div>
                        {/*<div className="text-xs text-neutral-500">#{String(category.id).padStart(3, "0")}</div>*/}
                    </div>
                </div>
            </td>
            <td className="px-4 py-2">
                <div className="font-medium leading-tight">{category.parentName ? category.parentName : '--------'}</div>
            </td>
            <td className="px-4 py-2">
                <div className=" text-xs text-gray-500">
                    {category.childs && category.childs.length > 0 ? category.childs.map(x => x.name).join(' | ') : '--------'}
                </div>
            </td>
            <td className="px-4 py-2">
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => onEditCategory(category)}
                        type="button" data-drawer-target="drawer-form" data-drawer-show="drawer-form" aria-controls="drawer-form"
                        className="
                            inline-flex items-center justify-center
                            px-3 py-1.5 rounded-xl text-xs font-medium
                            bg-blue-800 text-white
                            hover:bg-blue-600
                            dark:bg-blue-600 dark:hover:bg-blue-600

                            transition-all duration-300
                            hover:scale-125
                            active:scale-85

                            hover:shadow-xl
                            hover:ring-2 hover:ring-blue-400
                            ring-offset-0 dark:ring-offset-neutral-900">

                        <BiEdit size={20} />
                    </button>

                    <button
                        className="
                            inline-flex items-center justify-center
                            px-3 py-1.5 rounded-xl text-xs font-medium
                            bg-red-800 text-white
                            hover:bg-red-600
                            dark:bg-red-600 dark:hover:bg-red-600

                            transition-all duration-300
                            hover:scale-125
                            active:scale-85

                            hover:shadow-xl
                            hover:ring-2 hover:ring-red-400
                            ring-offset-0 dark:ring-offset-neutral-900"
                        onClick={() => onDeleteCategory(category.id)}>

                        <MdDeleteOutline size={20} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CategoryRow;
