import axios, {type AxiosError} from 'axios'
import {authThunks} from '../features/auth/api'
import {authActions} from '../features/auth/store/auth-slice'

import {ACTION_TYPES, store} from './store'

export const PENDING_REQUESTS = {
  USERS: new Set<string>(),
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.auth.accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let isTokenRefreshing = false

export const refreshToken = async (): Promise<string | undefined> => {
  if (isTokenRefreshing) {
    console.error('TOKEN IS ALREADY REFRESHING')
    return
  }
  const state = store.getState()
  const refreshToken = state.auth.session?.refreshToken

  if (!refreshToken) {
    store.dispatch({type: ACTION_TYPES.RESET})

    return
  }

  try {
    isTokenRefreshing = true

    const newAccessToken = await store
      .dispatch(authThunks.refreshToken({refreshToken}))
      .unwrap()

    store.dispatch(authActions.setAccessToken(newAccessToken))

    return newAccessToken
  } catch (err) {
    await store.dispatch(authThunks.logOut())

    throw err
  } finally {
    isTokenRefreshing = false
  }
}
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    try {
      const newAccessToken = await refreshToken()
      if (!newAccessToken) {
        return Promise.reject(error)
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch (err) {
      await store.dispatch(authThunks.logOut())

      return Promise.reject(err)
    }
  }
)

export {api}
