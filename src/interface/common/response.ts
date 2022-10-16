//通用响应
export interface Response<T> {
    result: T
    message: string
    status: number
}
//分页
export interface PageBean<T> {
    page: Array<T>
    pageIndex: number
    pageSize: number
    totalPages: number
    totalCount: number
}
//上传结果
export interface UploadResult {
    path: string
}