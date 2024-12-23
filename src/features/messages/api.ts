import {AxiosError} from 'axios'

import {createAsyncThunk} from '@reduxjs/toolkit'

import {api} from '../../app/api'

import {GetMessagesDirection, GetMessagesParams, Message} from './types'
import {RootState} from '../../app/store'
import {selectMessageBySequenceId} from './state/messages-selectors'
import {pause} from '../../shared/helpers/pause'

const getMessages = createAsyncThunk<Message[], GetMessagesParams>(
  'messages/getMessages',
  async (arg, thunkApi) => {
    try {
      await pause(1000)
      const result = await api.get<Message[]>('/messages', {
        params: {
          ...arg,
        } satisfies GetMessagesParams,
      })

      return result.data
    } catch (e) {
      if (e instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          e.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[auth/signUp]')
    }
  }
)

const scrollToMessage = createAsyncThunk(
  'messages/scrollToMessage',
  async (
    arg: {chatId: string; sequenceId: number; highlight?: boolean},
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState
    const {chatId, sequenceId, highlight = true} = arg
    const message = selectMessageBySequenceId(state, chatId, sequenceId)

    if (!message) {
      await thunkApi.dispatch(
        getMessages({
          sequenceId,
          chatId,
          direction: GetMessagesDirection.AROUND,
          limit: 40,
        })
      )
    }
    return {chatId, sequenceId, highlight, replaceList: !message}
  }
)

export const messagesThunks = {getMessages, scrollToMessage}
