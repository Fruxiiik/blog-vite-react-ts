import { useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTypedSelector } from '@/hooks/useTypedSelector'
import { selectIsAuth } from '@/store'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = useTypedSelector(selectIsAuth)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuth) navigate('/sign-in')
  }, [isAuth, navigate])
  return isAuth ? children : null
}
