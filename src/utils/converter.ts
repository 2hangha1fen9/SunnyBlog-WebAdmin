//日期格式化
export function dateTimeFormatter(date: string) {
    const d = new Date(date)
    const year = d.getFullYear().toString().padStart(4, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = (d.getDate().toString().padStart(2, '0'))
    const hour = d.getHours()
    const minutes = d.getMinutes()
    const second = d.getSeconds()
    return `${year}-${month}-${day} ${hour}:${minutes}:${second}`
}
export function dateFormatter(date: string) {
    const d = new Date(date)
    const year = d.getFullYear().toString().padStart(4, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = (d.getDate().toString().padStart(2, '0'))
    return `${year}-${month}-${day}`
}