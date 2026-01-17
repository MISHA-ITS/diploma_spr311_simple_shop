export interface ICategory {
    id: number,
    name: string,
    imageUrl?: string | null,
    parentId: number | null,
    parentName?: string,
    childs: ICategory[],
}

///
export interface ICategoryTreeNode {
    title: string;
    value: number;
    key: number;
    children?: ICategoryTreeNode[];
}


export interface ICategoryRowProps {
    category: ICategory;
    onDeleteCategory: (categoryId: number) => Promise<void>;
    onEditCategory: (category: ICategory) => void;
}

export interface Props {
    count: number;
    children: React.ReactNode;
    onCreate?: () => void;
    onRefresh?: () => void;
}

export type CategoryNode = ICategory & {
    children: CategoryNode[];
};


