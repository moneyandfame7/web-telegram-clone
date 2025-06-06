import {createSlice, type PayloadAction} from '@reduxjs/toolkit'

import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import {USER_BROWSER, USER_PLATFORM} from '../../../app/environment'

import {
  type AuthorizationResult,
  AuthScreen,
  type DeviceInfo,
  type Session,
} from '../types'
import {authThunks} from '../api'

export interface AuthState {
  screen: AuthScreen
  session?: Session
  accessToken?: string
  isLoading: boolean
  keepSignedIn: boolean
  deviceInfo: DeviceInfo
}

const initialState: AuthState = {
  screen: AuthScreen.Username,
  isLoading: false,
  keepSignedIn: true,
  deviceInfo: {
    ip: 'Unknown',
    location: 'Unknown',
    browser: USER_BROWSER,
    platform: USER_PLATFORM,
  },
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    },
    setScreen: (state, action: PayloadAction<AuthScreen>) => {
      state.screen = action.payload
    },
    setAuthorization: (state, action: PayloadAction<AuthorizationResult>) => {
      const {accessToken, session} = action.payload

      state.session = session
      state.accessToken = accessToken
    },
    setKeepSignedIn: (state, action: PayloadAction<boolean>) => {
      state.keepSignedIn = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authThunks.getGeolocation.fulfilled, (state, action) => {
      const {ipAddress: ip, countryName, regionName, cityName} = action.payload
      state.deviceInfo.ip = ip
      state.deviceInfo.location = `${countryName}, ${regionName}, ${cityName}`
    })

    builder.addCase(authThunks.signIn.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(authThunks.signIn.fulfilled, (state) => {
      state.isLoading = false
    })
    builder.addCase(authThunks.signIn.rejected, (state) => {
      state.isLoading = false
    })

    builder.addCase(authThunks.signUp.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(authThunks.signUp.fulfilled, (state) => {
      state.isLoading = false
    })
    builder.addCase(authThunks.signUp.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const authActions = authSlice.actions

export const persistedAuthReducer = persistReducer(
  {
    key: 'auth',
    storage: storage,
    blacklist: ['screen', 'isLoading'] as (keyof AuthState)[],
  },
  authSlice.reducer
)
