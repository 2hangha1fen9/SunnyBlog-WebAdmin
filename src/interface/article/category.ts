export interface Category {
    id: number
    name: string
    userId: number
    parentId: number
    inverseParent: Array<Category>
}