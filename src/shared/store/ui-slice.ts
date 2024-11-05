import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RightColumnScreen} from '../types/ui-types'

export interface UIState {
  isUpdating: boolean
  settingsScreen: string
  rightColumnScreen?: RightColumnScreen
}

const initialState: UIState = {
  isUpdating: false,
  settingsScreen: '',
}

export const uiSlice = createSlice({
  name: 'uiSlice',
  initialState,
  reducers: {
    setIsUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
    setRightColumn: (
      state,
      action: PayloadAction<RightColumnScreen | undefined>
    ) => {
      state.rightColumnScreen = action.payload
    },
  },
})

export const uiActions = uiSlice.actions

export const uiReducer = uiSlice.reducer
