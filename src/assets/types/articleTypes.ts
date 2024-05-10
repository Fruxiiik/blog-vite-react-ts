export interface Author {
  username: string
  bio: string
  image: string
  following: boolean
}

export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: Author
}

export interface ArticleData {
  title: string
  description: string
  body: string
  tagList: string[]
}

export interface ArticleState {
  article: Article | null
  currentArticle: string | null
  isLoading: boolean
  isEditing: boolean
  isFollowProcess: boolean
}
