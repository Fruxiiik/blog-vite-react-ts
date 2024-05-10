import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Stack from '@mui/material/Stack'
import { Box, CircularProgress } from '@mui/material'

import { useTypedSelector } from '@/hooks/useTypedSelector'
import { getArticles } from '@/store/slices/articlesSlice'
import { Article } from '@/components/Article'
import { AppDispatch } from '@/store'

import styles from './ArticleList.module.scss'

export const ArticleList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { articles, isLoading, articleIndex } = useTypedSelector((state) => state.articles)
  useEffect(() => {
    if (!isLoading) {
      dispatch(getArticles(articleIndex))
    }
  }, [articleIndex])
  function renderContent() {
    if (isLoading) {
      return <CircularProgress className={styles.loadingSpinner} />
    }
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Stack className={styles.container} spacing={2}>
          {articles.map((article) => (
            <Article key={article.slug} article={article} isFullArticle={false} />
          ))}
        </Stack>
      </Box>
    )
  }

  return <div className={styles.root}>{renderContent()}</div>
}
