import {createAsyncThunk} from '@reduxjs/toolkit'
import {AxiosError, AxiosResponse} from 'axios'

import {api} from '../../app/api'
import type {
  AuthorizationResult,
  Geolocation,
  RefreshTokenPayload,
  SignInPayload,
  SignUpPayload,
} from './types'
import {ACTION_TYPES, persistor, RootState, store} from '../../app/store'
import {authActions} from './store/auth-slice'

const getGeolocation = createAsyncThunk<Geolocation, void>(
  'auth/getGeolocation',
  async (_, thunkApi) => {
    try {
      const response = await api.get<Geolocation>('', {
        baseURL: 'https://freeipapi.com/api/json',
      })

      return response.data
    } catch (e) {
      return thunkApi.rejectWithValue('[auth/getGeolocation] error')
    }
  }
)

const signIn = createAsyncThunk<
  AuthorizationResult,
  SignInPayload,
  {rejectValue: string}
>('auth/signIn', async (arg, thunkApi) => {
  try {
    const state = thunkApi.getState() as RootState

    const response = await api.post<AuthorizationResult>(
      '/authorization/sign-in',
      arg
    )
    if (!state.auth.keepSignedIn) {
      persistor.pause()
      persistor.purge()
    }
    thunkApi.dispatch(authActions.setAuthorization({...response.data}))

    return response.data
  } catch (e) {
    if (e instanceof AxiosError) {
      return thunkApi.rejectWithValue(
        e.response?.data?.message || 'Unknown error'
      )
    }

    return thunkApi.rejectWithValue('Error in sign in')
  }
})

const signUp = createAsyncThunk<
  AuthorizationResult,
  SignUpPayload,
  {rejectValue: string}
>('auth/signUp', async (arg, thunkApi) => {
  try {
    const state = thunkApi.getState() as RootState

    const response = await api.post<AuthorizationResult>(
      '/authorization/sign-up',
      arg
    )
    if (!state.auth.keepSignedIn) {
      persistor.pause()
      persistor.purge()
    }
    thunkApi.dispatch(authActions.setAuthorization({...response.data}))
    return response.data
  } catch (e) {
    if (e instanceof AxiosError) {
      return thunkApi.rejectWithValue(
        e.response?.data?.message || 'Unknown error'
      )
    }

    return thunkApi.rejectWithValue('[auth/signUp]')
  }
})

const logOut = createAsyncThunk<boolean, void, {rejectValue: string}>(
  'auth/logOut',
  async (_, thunkApi) => {
    try {
      const refreshToken = (thunkApi.getState() as RootState).auth.session
        ?.refreshToken

      if (!refreshToken) {
        throw new Error('Refresh token is missing')
      }

      const response = await api.post<
        boolean,
        AxiosResponse<boolean>,
        RefreshTokenPayload
      >('/authorization/logout', {refreshToken})

      return response.data
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          e.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[auth/logOut]')
    } finally {
      thunkApi.dispatch({type: ACTION_TYPES.RESET})
    }
  }
)

const protectedEndpoint = createAsyncThunk(
  'auth/protected',
  async (_, thunkApi) => {
    try {
      const response = await api.get('/authorization/protected')

      return response.data
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          e.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[auth/protected]')
    }
  }
)

const refreshToken = createAsyncThunk<
  string,
  RefreshTokenPayload,
  {rejectValue: string}
>('auth/refresh', async (arg, thunkApi) => {
  try {
    const response = await api.post('/authorization/refresh', arg)

    return response.data
  } catch (e) {
    /**
     *  @todo: потрібно викликати тут модалку, що рефреш токен здох (тобто сесія expired)
     */
    if (e instanceof AxiosError) {
      return thunkApi.rejectWithValue(
        e.response?.data?.message || 'Unknown error'
      )
    }

    return thunkApi.rejectWithValue('[auth/refreshToken]')
  }
})

export const authThunks = {
  signIn,
  signUp,
  getGeolocation,
  protectedEndpoint,
  refreshToken,
  logOut,
}
