import {createAsyncThunk} from '@reduxjs/toolkit'
import {
  ChatDetails,
  ChatInfoUpdateParams,
  ChatInviteLink,
  ChatInviteLinks,
  ChatPrivacyUpdateParams,
  CreateChatInviteLinkParams,
  UpdateAdminParams,
  type Chat,
  type CreateChatParams,
  type GetChatsResult,
} from './types'
import {api} from '../../app/api'
import {AxiosError} from 'axios'
import {IdPayload} from '../../app/types'
import {RootState} from '../../app/store'
import {isUserId} from '../users/helpers'
import {chatsSelectors} from './state/chats-selectors'
import {chatsActions} from './state/chats-slice'
import {usersThunks} from '../users/api'
import {emitEventWithHandling} from '../../app/socket'

const createChat = createAsyncThunk<Chat, CreateChatParams>(
  'chats/createChat',
  async (arg) => {
    return emitEventWithHandling<CreateChatParams, Chat>('chat:create', arg)
  }
)

const getChats = createAsyncThunk<GetChatsResult>(
  'chats/getChats',
  async (_, thunkApi) => {
    try {
      const res = await api.get<GetChatsResult>(`/chats`)
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

const getChatDetails = createAsyncThunk<ChatDetails, string>(
  'chats/getChatDetails',
  async (arg, thunkApi) => {
    try {
      const res = await api.get<ChatDetails>(`/chats/${arg}/details`)

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

const getChatInviteLinks = createAsyncThunk<ChatInviteLinks, string>(
  'chats/getChatInviteLinks',
  async (arg) => {
    const res = await api.get<ChatInviteLinks>(`/chats/${arg}/invite-links`)

    return res.data
  }
)

const createChatInviteLink = createAsyncThunk<
  ChatInviteLink,
  CreateChatInviteLinkParams
>('chats/createChatInviteLink', async (arg) => {
  const res = await api.post<ChatInviteLink>(
    `/chats/${arg.chatId}/invite-links`,
    arg
  )
  return res.data
})

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

const updateChatInfo = createAsyncThunk<boolean, ChatInfoUpdateParams>(
  'chats/updateChatInfo',
  async (arg, thunkApi) => {
    const result = await emitEventWithHandling<ChatInfoUpdateParams, boolean>(
      'chat:update-info',
      arg
    )

    thunkApi.dispatch(
      chatsActions.updateOne({
        id: arg.chatId,
        changes: {
          title: arg.title,
          ...('description' in arg && {description: arg.description}),
        },
      })
    )
    return result
  }
)

const updateChatPrivacy = createAsyncThunk<boolean, ChatPrivacyUpdateParams>(
  'chats/updateChatPrivacy',
  async (arg, thunkApi) => {
    const result = await emitEventWithHandling<
      ChatPrivacyUpdateParams,
      boolean
    >('chat:update-privacy', arg)

    thunkApi.dispatch(
      chatsActions.updateOne({
        id: arg.chatId,
        changes: {
          allowSavingContent: arg.allowSavingContent,
          privacyType: arg.privacyType,
        },
      })
    )
    return result
  }
)

const updateAdmin = createAsyncThunk<boolean, UpdateAdminParams>(
  'chats/updateAdmin',
  async (arg, thunkApi) => {
    try {
      const res = await emitEventWithHandling<UpdateAdminParams, boolean>(
        'chat:update-admin',
        arg
      )

      thunkApi.dispatch(
        chatsActions.updateChatMember({
          chatId: arg.chatId,
          userId: arg.userId,
          changes: {
            adminPermissions: arg.adminPermissions,
          },
        })
      )

      return res
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

export const chatsThunks = {
  createChat,
  getChats,
  getChat,
  getChatDetails,
  getChatInviteLinks,
  createChatInviteLink,
  openChat,
  updateChatInfo,
  updateChatPrivacy,
  updateAdmin,
}
