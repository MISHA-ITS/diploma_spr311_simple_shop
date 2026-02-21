import {ICategory} from "../../../models/category.ts";

export const createParentDic = (categories: ICategory[]) => {
    const dic: Record<number, number | null> = {};

    categories.forEach(cat => {
        dic[cat.id] = cat.parentId || null;
    });

    return dic;
};

export const findPath = (targetId: number, parentDic: Record<number, number | null>) => {
    const path = [];
    let currentId: number | null = targetId;

    while (currentId !== null) {
        path.unshift(currentId); // Додаємо в початок масиву
        currentId = parentDic[currentId]; // Стрибаємо до батька
    }

    return path; // Поверне масив ID: [батько_рівень1, батько_рівень2, ціль]
};

