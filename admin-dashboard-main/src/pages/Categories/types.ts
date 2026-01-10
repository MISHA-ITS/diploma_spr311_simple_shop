export interface ICategoryItem {
    id: number;
    name: string;
    priority: number;
    urlSlug: string;
    parentId: number | null;
    imageUrl?: string | null;
}

export interface ICategoryRowProps {
    category: ICategoryItem;
    onDeleteCategory: (categoryId: number) => Promise<void>;
}

export interface Props {
    count: number;
    children: React.ReactNode;
}

export type CategoryNode = ICategoryItem & {
    children: CategoryNode[];
};