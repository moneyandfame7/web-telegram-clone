import {
  combineReducers,
  configureStore,
  createAsyncThunk,
  createSelector,
  type Action,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit'
import {type TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'

import {
  authActions,
  persistedAuthReducer,
} from '../features/auth/store/auth-slice'
import storage from 'redux-persist/lib/storage'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import {uiReducer} from '../shared/store/ui-slice'
import {persistedChatsReducer} from '../features/chats/chats-slice'
import {persistedUsersReducer} from '../features/users/users-slice'
import {authThunks} from '../features/auth/api'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth', 'chats', 'users', 'ui'],
}

export const ACTION_TYPES = {
  RESET: 'RESET',
}

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  chats: persistedChatsReducer,
  users: persistedUsersReducer,
  ui: uiReducer,
})

const reducerProxy = (state: any, action: Action) => {
  if (action.type === ACTION_TYPES.RESET) {
    storage.removeItem('persist:auth')
    storage.removeItem('persist:chats')
    storage.removeItem('persist:users')
    storage.removeItem('persist:root')

    window.location.reload()
    return rootReducer(undefined, action)
  }

  return rootReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, reducerProxy)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(),
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<R = void> = ThunkAction<
  R,
  RootState,
  unknown,
  UnknownAction
>

export const useAppDispatch = useDispatch<AppDispatch>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const createAppSelector = createSelector.withTypes<RootState>()
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  extra: unknown
}>()
