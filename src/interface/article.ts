export interface Tag{
    id:number
    userId:number
    name:string
    color:string
}
export interface Category{
    id:number
    name:string
    userId:number
    parentId:number
    inverseParent:Array<Category>
}
export interface Region{
    id:number
    name:string
    description:string
    parentId:number
    inverseParent:Array<Region>
}
export interface Article{
    id:number
    userId:number
    nick:string
    username:string
    title:string
    summary:string
    content:string
    photo:string
    regionName:string
    regionId:number
    tags:Array<Tag>
    categorys:Array<Category>
    status:number
    isLock:number
    commentStatus:number
    createTime:string
}
export interface ArticleId{
    id:number
}