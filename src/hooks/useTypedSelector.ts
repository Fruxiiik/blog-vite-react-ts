import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { RootState } from '@/assets/types/storeTypes'

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
