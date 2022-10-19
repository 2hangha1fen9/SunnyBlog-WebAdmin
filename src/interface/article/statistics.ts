export interface ArticleCountStatistics{
    articleCount:number
    tagCount:number
    showArticleCount:number
    penddingArticleCount:number
    lockArticleCount:number
    recycleArticleCount:number
    todayPublish:number
    yesterdayPublish:number
    weekPublish:number
    monthPublish:number
}

export interface ArticleTrendStatistics{
    date: string
    articleCount:number
}