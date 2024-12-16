import {createAsyncThunk} from '@reduxjs/toolkit'
import type {Chat, CreateChatParams} from './types'
import {api} from '../../app/api'
import {AxiosError} from 'axios'
import {IdPayload} from '../../app/types'
import {RootState} from '../../app/store'
import {isUserId} from '../users/helpers'
import {chatsSelectors} from './state/chats-selectors'
import {chatsActions} from './state/chats-slice'
import {usersThunks} from '../users/api'

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

const getChat = createAsyncThunk<Chat | undefined, string>(
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
    const {id} = arg

    if (isUserId(id)) {
      const userId = id.split('u_')[1]
      thunkApi.dispatch(usersThunks.getUser({id: userId}))

      const storedChat = chatsSelectors.selectByUserId(
        thunkApi.getState() as RootState,
        userId
      )
      const chat: Chat | undefined =
        storedChat ??
        (await thunkApi.dispatch(chatsThunks.getChat(`u_${userId}`)).unwrap())

      thunkApi.dispatch(chatsActions.setCurrentChat(chat?.id ?? `u_${userId}`))
    } else if (id) {
      thunkApi.dispatch(chatsActions.setCurrentChat(id))

      const storedChat = chatsSelectors.selectById(
        thunkApi.getState() as RootState,
        id
      )
      const chat =
        storedChat ??
        (await thunkApi.dispatch(chatsThunks.getChat(id)).unwrap())

      if (chat.userId) {
        thunkApi.dispatch(usersThunks.getUser({id: chat.userId}))
      }
    }
  }
)

export const chatsThunks = {createChat, getChats, getChat, openChat}
