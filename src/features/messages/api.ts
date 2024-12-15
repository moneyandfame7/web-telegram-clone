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

const scrollToMessage = createAsyncThunk<
  void,
  {chatId: string; sequenceId: number}
>('messages/scrollToMessage', async (arg, thunkApi) => {
  const state = thunkApi.getState() as RootState
  const {chatId, sequenceId} = arg
  const message = selectMessageBySequenceId(state, chatId, sequenceId)

  if (message) {
    console.log('SCROLL AND HIGHLIGHT')
    await thunkApi.dispatch(highlightMessage({sequenceId}))
  } else {
    await thunkApi.dispatch(
      getMessages({
        chatId,
        direction: GetMessagesDirection.AROUND,
        sequenceId,
        limit: 40,
      })
    )
    await thunkApi.dispatch(highlightMessage({sequenceId}))
  }
})

const highlightMessage = createAsyncThunk(
  'messages/highlightMessage',
  async ({sequenceId}: {sequenceId: number}) => sequenceId
)

// const readHistory = createAsyncThunk('messages/readHistory', async () => {})

export const messagesThunks = {getMessages, scrollToMessage, highlightMessage}
