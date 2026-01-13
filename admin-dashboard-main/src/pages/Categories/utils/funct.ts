import {ICategory, ICategoryTreeNode} from "../../../types/Category/types.ts";

export const buildTree = (
    categories: ICategory[],
    parentId: number | null | undefined = null, // Встановлюємо дефолтне значення
    excludeIds: number[] = []
): ICategoryTreeNode[] => {
    return categories
        .filter(x => {
            // Перевірка на виключення ID
            if (excludeIds.includes(x.id)) return false;

            // Використовуємо == щоб null, undefined та 0 вважалися однаковими для корня
            if (!parentId) {
                return !x.parentId || x.parentId === 0;
            }

            return x.parentId === parentId;
        })
        .map(x => ({
            title: x.name,
            value: x.id,
            key: x.id,
            children: buildTree(categories, x.id, excludeIds),
        }));
};