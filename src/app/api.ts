import axios, {type AxiosError} from 'axios'
import {ACTION_TYPES, store} from './store'
import {authThunks} from '../features/auth/api'
import {authActions} from '../features/auth/store/auth-slice'

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
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || isTokenRefreshing) {
      return Promise.reject(error)
    }
    isTokenRefreshing = true
    const state = store.getState()
    const refreshToken = state.auth.session?.refreshToken

    if (!refreshToken) {
      return store.dispatch({type: ACTION_TYPES.RESET})
    }

    try {
      const newAccessToken = await store
        .dispatch(authThunks.refreshToken({refreshToken}))
        .unwrap()

      store.dispatch(authActions.setAccessToken(newAccessToken))

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch (err) {
      await store.dispatch(authThunks.logOut())

      return Promise.reject(err)
    } finally {
      isTokenRefreshing = false
    }
  }
)

export {api}
