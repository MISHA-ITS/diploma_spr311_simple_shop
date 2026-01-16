export interface ICategory {
    id: number,
    name: string,
    imageUrl?: string | null,
    parentId: number | null,
    parentName?: string,
    childs: ICategory[],
}

export interface DrawerDataModel {
    isDrawerOpen: boolean,
    selectedCategory: ICategory | undefined
}
export interface CategoryCreateProps {
    open: boolean,
    onClose: () => void
    category?: ICategory
}

export interface ICategoryRowProps {
    category: ICategory;
    onDeleteCategory: (categoryId: number) => Promise<void>;
    onEditCategory: (category: ICategory) => void;
}

export interface Props {
    count: number;
    children: React.ReactNode;
}

export type CategoryNode = ICategory & {
    children: CategoryNode[];
};
