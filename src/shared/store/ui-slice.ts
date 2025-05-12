import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface UIState {
  isUpdating: boolean
  settingsScreen: string
  isRightColumnActive: boolean
}

const initialState: UIState = {
  isUpdating: false,
  settingsScreen: '',
  isRightColumnActive: false,
}

export const uiSlice = createSlice({
  name: 'uiSlice',
  initialState,
  reducers: {
    setIsUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
    setRightColumnActive: (state, action: PayloadAction<boolean>) => {
      state.isRightColumnActive = action.payload
    },
  },
})

export const uiActions = uiSlice.actions

export const uiReducer = uiSlice.reducer
