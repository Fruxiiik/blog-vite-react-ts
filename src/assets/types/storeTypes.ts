import { store } from '@/store'

export type RootState = ReturnType<typeof store.getState>
export const selectIsAuth = (state: RootState) => Boolean(state.auth.isAuthenticated)
