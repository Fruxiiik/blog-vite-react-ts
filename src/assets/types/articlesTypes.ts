import { Article } from '@/assets/types/articleTypes'

export interface ArticlesState {
  articles: Article[]
  paginationCount: number
  isLoading: boolean
  articleIndex: number
}
