import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CircularProgress } from '@mui/material'

import { AppDispatch } from '@/store'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { Article } from '@/components/Article'
import { getArticle, setCurrentArticle } from '@/store/slices/articleSlice'

import styles from './FullArticle.module.scss'

export const FullArticle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { article, isLoading, currentArticle } = useTypedSelector((state) => state.article)
  const articleData = article
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  useEffect(() => {
    if (currentArticle !== location.pathname.split('/').at(-1)) {
      dispatch(setCurrentArticle(location.pathname.split('/').at(-1)))
      dispatch(getArticle(location.pathname.split('/').at(-1) as string))
    }
  }, [article])
  useEffect(() => {
    if (!isLoading && slug) {
      dispatch(getArticle(slug))
    }
  }, [slug, dispatch])
  function renderContent() {
    if (isLoading || !articleData) {
      return <CircularProgress />
    }
    return <Article article={articleData} isFullArticle />
  }

  return <div className={styles.root}>{renderContent()}</div>
}
