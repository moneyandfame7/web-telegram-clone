import {
  combineReducers,
  configureStore,
  createAsyncThunk,
  createListenerMiddleware,
  createSelector,
  type Action,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit'
import {type TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
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
import storage from 'redux-persist/lib/storage'

import {persistedAuthReducer} from '../features/auth/store/auth-slice'
import {persistedUsersReducer} from '../features/users/state/users-slice'
import {persistedMessagesReducer} from '../features/messages/state/messages-slice'
import {persistedChatsReducer} from '../features/chats/state/chats-slice'

import {uiReducer} from '../shared/store/ui-slice'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth', 'chats', 'messages', 'users', 'ui'],
}

export const ACTION_TYPES = {
  RESET: 'RESET',
}

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  chats: persistedChatsReducer,
  users: persistedUsersReducer,
  messages: persistedMessagesReducer,
  ui: uiReducer,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducerProxy = (state: any, action: Action) => {
  if (action.type === ACTION_TYPES.RESET) {
    storage.removeItem('persist:auth')
    storage.removeItem('persist:chats')
    storage.removeItem('persist:messages')
    storage.removeItem('persist:users')
    storage.removeItem('persist:root')

    window.location.reload()
    return rootReducer(undefined, action)
  }

  return rootReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, reducerProxy)

export const listenerMiddleware = createListenerMiddleware()
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(listenerMiddleware.middleware)
      .concat(),
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
