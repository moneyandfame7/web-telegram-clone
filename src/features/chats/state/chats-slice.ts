import {
  createSlice,
  EntityState,
  Update,
  type PayloadAction,
} from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage'
import {chatsThunks} from '../api'
import {
  chatDetailsAdapter,
  chatMembersAdapter,
  chatsAdapter,
} from './chats-adapter'
import {Message} from '../../messages/types'
import {Chat, ChatMember} from '../types'

interface ChatsState {
  currentChatId?: string
  details: EntityState<ChatDetailsState, string>
}

export interface ChatDetailsState {
  chatId: string
  members: EntityState<ChatMember, string>
  adminIds: string[]
  kickedIds: string[]
}

const chatsSlice = createSlice({
  name: 'chatsSlice',
  initialState: chatsAdapter.getInitialState<ChatsState>({
    details: chatDetailsAdapter.getInitialState({}),
  }),
  reducers: {
    setCurrentChat: (state, action: PayloadAction<string | undefined>) => {
      state.currentChatId = action.payload
    },
    addOne: chatsAdapter.addOne,
    updateOne: chatsAdapter.updateOne,
    updateLastMessage: (
      state,
      action: PayloadAction<Update<Message, string>>
    ) => {
      const {id, changes} = action.payload

      const chat = state.entities[id] as Chat | undefined

      if (!chat || !chat.lastMessage) {
        return
      }

      chatsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          lastMessage: {
            ...chat.lastMessage,
            ...changes,
          },
        },
      })
    },
    setLastMessage: (
      state,
      action: PayloadAction<{chatId: string; message: Message | null}>
    ) => {
      const {chatId, message} = action.payload

      const chat = state.entities[chatId] as Chat | undefined

      if (!chat) {
        console.warn(`Chat ${chatId} not found for settings last message.`)
        return
      }
      chatsAdapter.updateOne(state, {
        id: chatId,
        changes: {
          lastMessage: message ?? undefined,
        },
      })
    },
    updateChatMember: (
      state,
      action: PayloadAction<{
        userId: string
        chatId: string
        changes: Partial<ChatMember>
      }>
    ) => {
      const {userId, chatId, changes} = action.payload

      const details = state.details.entities[chatId] as
        | ChatDetailsState
        | undefined

      if (!details) {
        return
      }

      chatMembersAdapter.updateOne(details.members, {
        id: userId,
        changes,
      })

      if (typeof changes.adminPermissions !== 'undefined') {
        const alreadyAdmin = details.adminIds.includes(userId)
        if (changes.adminPermissions && !alreadyAdmin) {
          details.adminIds.push(userId)
        } else if (changes.adminPermissions === null) {
          details.adminIds = details.adminIds.filter((id) => id !== userId)
        }
      }
    },
    updateChatMemberList: (
      state,
      action: PayloadAction<
        | {
            chatId: string
            members: ChatMember[]
            filter: 'members'
          }
        | {
            chatId: string
            members: string[]
            filter: 'adminIds' | 'kickedIds'
          }
      >
    ) => {
      const {chatId, filter, members} = action.payload
      const details = state.details.entities[chatId] as
        | ChatDetailsState
        | undefined
      if (!details) {
        return
      }
      if (filter === 'members') {
        chatMembersAdapter.setAll(details.members, members)
      } else {
        details[filter] = members
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(chatsThunks.createChat.fulfilled, (state, action) => {
      chatsAdapter.addOne(state, action.payload)
    })

    builder.addCase(chatsThunks.getChats.fulfilled, (state, action) => {
      chatsAdapter.setMany(state, action.payload.chats)
    })

    builder.addCase(chatsThunks.getChat.fulfilled, (state, action) => {
      if (action.payload) {
        chatsAdapter.setOne(state, action.payload)
      }
    })

    builder.addCase(chatsThunks.getChatDetails.fulfilled, (state, action) => {
      if (action.payload) {
        const {adminIds, kickedIds, members, chatId} = action.payload

        chatDetailsAdapter.setOne(state.details, {
          chatId,
          kickedIds,
          adminIds,
          members: chatMembersAdapter.setAll(
            chatMembersAdapter.getInitialState(),
            members
          ),
        })
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
