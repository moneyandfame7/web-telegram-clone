import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface UIState {
  isUpdating: boolean
  settingsScreen: string
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
  },
})

export const {setIsUpdating} = uiSlice.actions

export const uiReducer = uiSlice.reducer
