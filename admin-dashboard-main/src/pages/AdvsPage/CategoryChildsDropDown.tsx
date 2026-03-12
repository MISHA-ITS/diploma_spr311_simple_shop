import {FC, useState} from "react";
import moreIcon from "../../icons/More.png";
import {ICategory} from "../../types/Category/types.ts";

type CategoryChildsDropDownProps = {
    category: ICategory | null;
    isOpen: boolean;
    onToggle: () => void;
    onChangeCategory: (categoryId: number | null) => void;
}

const CategoryChildsDropDown: FC<CategoryChildsDropDownProps> = ({ category, isOpen, onToggle, onChangeCategory }) => {
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

    const handleSelectedCategory = (newCategory: ICategory | null) => {
        setSelectedCategory(newCategory ? newCategory : category);
        console.log(selectedCategory?.parentId)

        onChangeCategory(newCategory ? newCategory.id : category!.parentId);
        onToggle();
    }

    if(!category) return null;

    const categoryDisplayName = !category.parentId ? "Підкатегорія" : category.name;

    return (
        <div className="relative">
            <button
                onClick={() => onToggle()}
                className="flex justify-between items-center px-6 py-3 gap-5 w-full h-[48px] border-2 border-[rgba(0,23,72,0.58)] rounded-[5px] bg-white"
            >
                <span className="font-inter font-normal text-[16px] leading-[19px] text-[rgba(7,23,57,0.5)]">
                    {categoryDisplayName}
                </span>

                <img
                    src={moreIcon}
                    alt="More"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <ul className="absolute mt-1 w-[300px] bg-white no-scrollbar border-2 border-[rgba(0,23,72,0.58)] rounded-[5px] shadow-lg z-40 max-h-60 overflow-auto divide-y divide-gray-200">
                    {category.parentId && (
                        <li
                            className="px-4 py-3 hover:bg-gray-100 font-inter cursor-pointer font-medium"
                            onClick={() => handleSelectedCategory(null)}
                        >
                            Назад
                        </li>
                    )}

                    {category!.childs.map((child) => (
                        <li
                            key={child.id}
                            className="px-4 py-3 hover:bg-gray-100 font-inter cursor-pointer flex items-center justify-between"
                            onClick={() => handleSelectedCategory(child)}
                        >
                            <span>{child.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default CategoryChildsDropDown;