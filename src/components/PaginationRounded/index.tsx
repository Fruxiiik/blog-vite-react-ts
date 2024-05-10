import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

import { useTypedSelector } from '@/hooks/useTypedSelector'
import { setArticleIndex } from '@/store/slices/articlesSlice'

import styles from './PaginationRounded.module.scss'

export const PaginationRounded: React.FC = () => {
  const dispatch = useDispatch()
  const { paginationCount } = useTypedSelector((state) => state.articles)
  const initialPage = parseInt(localStorage.getItem('articlesIndex') || '0', 10) + 1
  const [page, setPage] = useState(initialPage)
  useEffect(() => {
    dispatch(setArticleIndex(page))
  }, [dispatch, page])
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    dispatch(setArticleIndex(value))
    localStorage.setItem('articlesIndex', (value - 1).toString())
  }
  return (
    <Stack className={styles.stack} spacing={2}>
      <Pagination
        className={styles.pagination}
        count={paginationCount}
        shape="rounded"
        onChange={handleChange}
        page={page}
        sx={{
          '.MuiPaginationItem-root.Mui-selected': {
            backgroundColor: '#1890FF',
            color: 'white',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              scale: '1.05',
              color: 'white',
            },
          },
        }}
      />
    </Stack>
  )
}
