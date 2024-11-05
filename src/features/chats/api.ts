import {createAsyncThunk} from '@reduxjs/toolkit'
import type {Chat, CreateChatParams} from './types'
import {api} from '../../app/api'
import {AxiosError} from 'axios'
import {IdPayload} from '../../app/types'
import {RootState} from '../../app/store'
import {isUserId} from '../users/helpers'
import {chatsSelectors} from './state/chats-selectors'
import {chatsActions} from './state/chats-slice'

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

const getChat = createAsyncThunk<Chat, string>(
  'chats/getChat',
  async (arg, thunkApi) => {
    try {
      const res = await api.get<Chat>(`/chats/${arg}`)

      return res.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[chats/getChat] error')
    }
  }
)

const openChat = createAsyncThunk<void, IdPayload>(
  'chats/openChat',
  async (arg, thunkApi) => {
    const state = thunkApi.getState() as RootState

    const chat: Chat | undefined = chatsSelectors.selectById(state, arg.id)

    const isPrivateChat = isUserId(arg.id)

    if (!chat) {
      if (!isPrivateChat) {
        thunkApi.dispatch(getChat(arg.id))
      }
    }

    thunkApi.dispatch(chatsActions.setCurrentChat(arg.id))
  }
)

export const chatsThunks = {createChat, getChats, getChat, openChat}
