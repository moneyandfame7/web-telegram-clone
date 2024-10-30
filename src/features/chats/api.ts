import {createAsyncThunk} from '@reduxjs/toolkit'
import type {Chat, CreateChatParams} from './types'
import {api} from '../../app/api'
import {AxiosError} from 'axios'

const createChat = createAsyncThunk<Chat, CreateChatParams>(
  'chats/createChat',
  async (arg, thunkApi) => {
    try {
      const res = await api.post<Chat>(`/chats`, arg)
      return res.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[chats/createChat] error')
    }
  }
)

const getChats = createAsyncThunk<Chat[]>(
  'chats/getChats',
  async (_, thunkApi) => {
    try {
      const res = await api.get<Chat[]>(`/chats`)
      return res.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[chats/getChats] error')
    }
  }
)

export const chatsThunks = {createChat, getChats}
