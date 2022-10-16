import request from '@/utils/request'
//上传头像
export function uploadAvatar(formData: FormData, uid?: number, type = "photo") {
    return request({
        url: '/user-service/photo/upload',
        method: 'put',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
        params: {
            uid: uid ?? null,
            type: type
        }
    })
}