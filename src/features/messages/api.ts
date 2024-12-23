import {messagesSelectors} from './state/messages-selectors'
import {AxiosError} from 'axios'

import {createAsyncThunk} from '@reduxjs/toolkit'

import {api} from '../../app/api'

import {GetMessagesDirection, GetMessagesParams, Message} from './types'
import {RootState} from '../../app/store'
import {pause} from '../../shared/helpers/pause'
import {Chat, SendMessageParams} from '../chats/types'
import {emitEventWithHandling, socket} from '../../app/socket'
import {messagesActions} from './state/messages-slice'
import {chatsActions, chatsSelectors} from '../chats/state'

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
    const message = messagesSelectors.selectBySequenceId(
      state,
      chatId,
      sequenceId
    )

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

const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (arg: SendMessageParams, thunkApi) => {
    const state = thunkApi.getState() as RootState
    const chat: Chat | undefined = chatsSelectors.selectById(state, arg.chatId)

    const result = await emitEventWithHandling<
      SendMessageParams,
      {chat: Chat; message: Message}
    >('sendMessage', arg)

    thunkApi.dispatch(
      messagesActions.addMessage({
        chatId: result.chat.id,
        message: result.message,
      })
    )

    if (!chat) {
      thunkApi.dispatch(chatsActions.addOne(result.chat))

      socket.emit('join', `chat-${result.chat.id}`)
    } else {
      thunkApi.dispatch(
        chatsActions.updateOne({
          id: result.chat.id,
          changes: {
            lastMessage: result.chat.lastMessage,
          },
        })
      )
    }

    return {chatJustCreated: !chat, chatId: result.chat.id}
  }
)

export const messagesThunks = {getMessages, scrollToMessage, sendMessage}
