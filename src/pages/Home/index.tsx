import React from 'react'

import { ArticleList, PaginationRounded } from '@/components'

import styles from './Home.module.scss'

export const Home: React.FC = () => {
  return (
    <div className={styles.root}>
      <ArticleList />
      <PaginationRounded />
    </div>
  )
}
