import {messagesSelectors} from './state/messages-selectors'
import {AxiosError} from 'axios'

import {createAsyncThunk} from '@reduxjs/toolkit'

import {api, PENDING_REQUESTS} from '../../app/api'

import {
  DeleteMessagesParams,
  DeleteMessagesResult,
  EditMessageParams,
  ForwardMessagesParams,
  ForwardMessagesResult,
  GetMessagesDirection,
  GetMessagesParams,
  Message,
  ReadHistoryParams,
  ReadMyHistoryResult,
  SendMessageParams,
  UpdateMessageLocalParams,
} from './types'
import {RootState} from '../../app/store'
import {Chat} from '../chats/types'
import {emitEventWithHandling, socket} from '../../app/socket'
import {messagesActions} from './state/messages-slice'
import {chatsActions, chatsSelectors} from '../chats/state'
import {usersSelectors} from '../users/state/users-selectors'
import {usersThunks} from '../users/api'

const getMessages = createAsyncThunk<Message[], GetMessagesParams>(
  'messages/getMessages',
  async (arg, thunkApi) => {
    try {
      const {signal, ...params} = arg
      const state = thunkApi.getState() as RootState
      const result = await api.get<Message[]>('/messages', {
        params,
        signal,
      })

      result.data.forEach((m) => {
        const user = usersSelectors.selectById(state, m.senderId)

        if (!m.isOutgoing && !user && !PENDING_REQUESTS.USERS.has(m.senderId)) {
          thunkApi.dispatch(usersThunks.getUser({id: m.senderId}))
        }
      })

      return result.data
    } catch (e) {
      if (arg.signal?.aborted) {
        return thunkApi.rejectWithValue(
          `[SIGNAL_ABORTED]: ${arg.signal.reason}`
        )
      } else if (e instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          e.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[messages/getMessages]')
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

const updateMessageLocal = createAsyncThunk(
  'messages/updateMessageLocal',
  (arg: UpdateMessageLocalParams, thunkApi) => {
    const state = thunkApi.getState() as RootState
    const chat = chatsSelectors.selectById(state, arg.chatId)
    const message = messagesSelectors.selectById(state, arg.chatId, arg.id)

    if (!message || !chat) {
      return
    }

    const isLastMessage = message.id === chat.lastMessage?.id

    thunkApi.dispatch(
      messagesActions.updateMessage({
        id: arg.id,
        chatId: arg.chatId,
        changes: {
          ...(arg.text && {text: arg.text}),
          ...(arg.editedAt && {editedAt: arg.editedAt}),
          deleteLocal: arg.deleteLocal,
        },
      })
    )

    if (isLastMessage) {
      thunkApi.dispatch(
        chatsActions.updateLastMessage({
          id: arg.chatId,
          changes: {
            ...(arg.text && {text: arg.text}),
            ...(arg.editedAt && {editedAt: arg.editedAt}),
            deleteLocal: arg.deleteLocal,
          },
        })
      )
    }
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
    >('message:send', arg)

    thunkApi.dispatch(
      messagesActions.addMessage({
        chatId: result.chat.id,
        message: result.message,
      })
    )

    if (!chat) {
      thunkApi.dispatch(chatsActions.addOne(result.chat))

      // socket.emit('room:join', `chat-${result.chat.id}`)
    } else {
      thunkApi.dispatch(
        chatsActions.updateOne({
          id: result.chat.id,
          changes: {
            lastMessage: result.chat.lastMessage,
          },
        })
      )

      thunkApi.dispatch(
        scrollToMessage({
          chatId: result.chat.id,
          sequenceId: result.message.sequenceId,
          highlight: false,
        })
      )
    }

    return {chatJustCreated: !chat, chatId: result.chat.id}
  }
)

const editMessage = createAsyncThunk(
  'messages/editMessage',
  async (arg: EditMessageParams, thunkApi) => {
    const state = thunkApi.getState() as RootState
    const oldMessage = messagesSelectors.selectById(state, arg.chatId, arg.id)

    if (!oldMessage) {
      return
    }

    thunkApi.dispatch(
      updateMessageLocal({
        ...arg,
        editedAt: new Date().toISOString(),
      })
    )

    try {
      await emitEventWithHandling<EditMessageParams, boolean>(
        'message:edit',
        arg
      )
    } catch (error) {
      if (!oldMessage) {
        return
      }
      thunkApi.dispatch(
        updateMessageLocal({
          id: oldMessage.id,
          chatId: oldMessage.chatId,
          text: oldMessage.text,
          editedAt: oldMessage.editedAt,
        })
      )
    }
  }
)

/**
 * @todo локальне видалення + оновлення lastMessage
 * + пофіксити лист бо там не нормально оновлюється все чомусь.. можливо тут повʼязане щось з shift.
 */
const deleteMessages = createAsyncThunk(
  'messages/deleteMessages',
  async (arg: DeleteMessagesParams, thunkApi) => {
    const state = thunkApi.getState() as RootState
    const chat = chatsSelectors.selectById(state, arg.chatId)
    console.log('delete')
    arg.ids.forEach((id) => {
      thunkApi.dispatch(
        updateMessageLocal({id, chatId: arg.chatId, deleteLocal: true})
      )
      const isLastMessage = chat.lastMessage?.id === id
      console.log({isLastMessage})

      if (isLastMessage) {
        const newLastMessage = messagesSelectors.selectLastMessageLocal(
          thunkApi.getState() as RootState,
          arg.chatId
        )

        if (!newLastMessage) {
          return
        }

        thunkApi.dispatch(
          chatsActions.updateLastMessage({
            id: arg.chatId,
            changes: newLastMessage,
          })
        )
      }
    })

    try {
      const result = await emitEventWithHandling<
        DeleteMessagesParams,
        DeleteMessagesResult
      >('message:delete', arg)

      thunkApi.dispatch(
        messagesActions.removeManyMessages({chatId: arg.chatId, ids: arg.ids})
      )
      if (result.chat.lastMessage) {
        thunkApi.dispatch(
          chatsActions.updateLastMessage({
            id: arg.chatId,
            changes: result.chat.lastMessage,
          })
        )
      }
    } catch {
      arg.ids.forEach((id) => {
        thunkApi.dispatch(
          updateMessageLocal({id, chatId: arg.chatId, deleteLocal: false})
        )
      })
      if (!chat.lastMessage) {
        return
      }

      thunkApi.dispatch(
        chatsActions.updateLastMessage({
          id: arg.chatId,
          changes: chat.lastMessage,
        })
      )
    }
  }
)

const forwardMessages = createAsyncThunk(
  'messages/forwardMessages',
  async (arg: ForwardMessagesParams, thunkApi) => {
    const state = thunkApi.getState() as RootState
    const chat: Chat | undefined = chatsSelectors.selectById(
      state,
      arg.toChatId
    )

    const result = await emitEventWithHandling<
      ForwardMessagesParams,
      ForwardMessagesResult
    >('message:forward', arg)
    console.log({result})
    result.messages.forEach((message) => {
      thunkApi.dispatch(
        messagesActions.addMessage({
          chatId: result.chat.id,
          message: message,
        })
      )
    })

    if (!chat) {
      thunkApi.dispatch(chatsActions.addOne(result.chat))

      // socket.emit('room:join', `chat-${result.chat.id}`)
    } else {
      thunkApi.dispatch(
        chatsActions.updateOne({
          id: result.chat.id,
          changes: {
            lastMessage: result.chat.lastMessage,
          },
        })
      )

      thunkApi.dispatch(
        scrollToMessage({
          chatId: result.chat.id,
          sequenceId: result.messages[result.messages.length - 1].sequenceId,
          highlight: false,
        })
      )
    }

    return {chatJustCreated: !chat, chatId: result.chat.id}
  }
)

const readHistory = createAsyncThunk(
  'messages/readHistory',
  async (
    {
      chatId,
      virtuaEndIndex,
      virtuaStartIndex,
    }: {chatId: string; virtuaStartIndex: number; virtuaEndIndex: number},
    thunkApi
  ) => {
    const state = thunkApi.getState() as RootState
    const messages = messagesSelectors.selectAll(state, chatId)
    const chat = chatsSelectors.selectById(state, chatId)

    let newMyLastReadMessage

    for (let i = virtuaEndIndex; i >= virtuaStartIndex; i--) {
      const message = messages[i]

      if (message && !message.isOutgoing) {
        newMyLastReadMessage = message
        break // Зупиняємо пошук, якщо знайдено крайнє повідомлення
      }
    }
    if (!newMyLastReadMessage) {
      console.log('NO MESSAGE TO READ')
      return
    }

    console.log(
      chat.myLastReadMessageSequenceId,
      newMyLastReadMessage.sequenceId
    )

    if (
      (chat?.myLastReadMessageSequenceId ?? -1) <
      newMyLastReadMessage.sequenceId
    ) {
      console.log(
        `SHOULD READ THIS MESSAGE`,
        newMyLastReadMessage.sequenceId,
        chat?.myLastReadMessageSequenceId
      )

      const result = await emitEventWithHandling<
        ReadHistoryParams,
        ReadMyHistoryResult
      >('message:read-history', {
        chatId,
        maxId: newMyLastReadMessage.sequenceId,
      })

      thunkApi.dispatch(
        chatsActions.updateOne({
          id: result.chatId,
          changes: {
            myLastReadMessageSequenceId: result.maxId,
            unreadCount: result.unreadCount,
          },
        })
      )
    }
  }
)

export const messagesThunks = {
  getMessages,
  scrollToMessage,
  sendMessage,
  editMessage,
  readHistory,
  updateMessageLocal,
  deleteMessages,
  forwardMessages,
}
