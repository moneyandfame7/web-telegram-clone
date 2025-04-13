import {createEntityAdapter} from '@reduxjs/toolkit'
import {Chat, ChatMember} from '../types'
import {ChatDetailsState} from './chats-slice'

const chatsSortComparer = (a: Chat, b: Chat) => {
  if (!a.lastMessage || !b.lastMessage) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }

  return (
    new Date(b.lastMessage.createdAt).getTime() -
    new Date(a.lastMessage?.createdAt).getTime()
  )
}

export const chatsAdapter = createEntityAdapter<Chat, string>({
  selectId: (chat) => chat.id,
  sortComparer: chatsSortComparer,
})

export const chatDetailsAdapter = createEntityAdapter<ChatDetailsState, string>(
  {
    selectId: (details) => details.chatId,
  }
)
export const chatMembersAdapter = createEntityAdapter<ChatMember, string>({
  selectId: (member) => member.userId,
})
