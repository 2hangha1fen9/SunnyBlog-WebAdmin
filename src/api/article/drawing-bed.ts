import request from '@/utils/request'

//上传图片
export function uploadPicture(formData: FormData, aid?: number, uid?: number) {
    return request({
        url: '/article-service/drawingBed/upload',
        method: 'put',
        headers: { 'Content-Type': 'multipart/form-data' },
        params: {
            aid: aid ?? '',
            uid: uid ?? ''
        },
        data: formData
    })
}
