import request from '@/utils/request'
//上传头像
export function uploadAvatar(formData: FormData, uid?: number) {
    return request({
        url: '/user-service/photo/upload' + (uid ? `?uid=${uid}` : ''),
        method: 'put',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
    })
}