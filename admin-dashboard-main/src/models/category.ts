
export interface ICategory {
    id: number,
    name: string,
    imageUrl?: string | null,
    parentId: number | null,
    parentName?: string,
    childs: ICategory[],
}

export interface ICategoryPageRequest extends PageRequest {
    searchName?: string
    parentName: string
}

export interface PageRequest {
    size: number | undefined
    page: number | undefined
}

export interface PageResponse<T> {
    total:number
    items:T[]
}