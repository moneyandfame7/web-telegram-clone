import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage'
import {chatsThunks} from '../api'
import {chatsAdapter} from './chats-adapter'

interface ChatsState {
  currentChatId?: string
}

const chatsSlice = createSlice({
  name: 'chatsSlice',
  initialState: chatsAdapter.getInitialState<ChatsState>({}),
  reducers: {
    setCurrentChat: (state, action: PayloadAction<string | undefined>) => {
      state.currentChatId = action.payload
    },
    addOne: chatsAdapter.addOne,
    updateOne: chatsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(chatsThunks.createChat.fulfilled, (state, action) => {
      chatsAdapter.addOne(state, action.payload)
    })

    builder.addCase(chatsThunks.getChats.fulfilled, (state, action) => {
      chatsAdapter.setMany(state, action.payload)
    })

    builder.addCase(chatsThunks.getChat.fulfilled, (state, action) => {
      if (action.payload) {
        chatsAdapter.setOne(state, action.payload)
      }
    })
  },
})

export const chatsActions = chatsSlice.actions

export const persistedChatsReducer = persistReducer(
  {
    key: 'chats',
    storage: storage,
    blacklist: ['currentChatId'] as (keyof ChatsState)[],
  },
  chatsSlice.reducer
)
