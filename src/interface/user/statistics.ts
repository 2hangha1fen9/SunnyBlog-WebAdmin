export interface UserCountStatistics {
    userCount: number
    enableCount: number
    todayCount: number
    deisableCount: number
    yesterdayCount: number
    weekCount: number
    monthCount: number
}

export interface UserTrendStatistics {
    date: string
    userCount: number
}