import {RootState} from './../../../app/store'
import {createSelector} from '@reduxjs/toolkit'
import {
  chatDetailsAdapter,
  chatMembersAdapter,
  chatsAdapter,
} from './chats-adapter'
import {RootState} from '../../../app/store'
import {User} from '../../auth/types'
import {ChatMember} from '../types'

const baseChatsSelectors = chatsAdapter.getSelectors<RootState>(
  (state) => state.chats
)

const baseChatDetailsSelectors = chatDetailsAdapter.getSelectors<RootState>(
  (state) => state.chats.details
)

const baseChatMembersSelectors = chatMembersAdapter.getSelectors()

const selectByUserId = createSelector(
  [baseChatsSelectors.selectAll, (_, userId: string) => userId],
  (chats, userId) => {
    return chats.find((chat) => chat.userId === userId)
  }
)

const selectCurrentChat = createSelector(
  [
    (state: RootState) => state.chats.entities,
    (state: RootState) => state.chats.currentChatId,
  ],
  (chats, currentChatId) => {
    return currentChatId ? chats[currentChatId] : undefined
  }
)

const selectMembers = createSelector(
  [
    (state: RootState) => state.users.entities,
    (state: RootState, chatId: string) =>
      state.chats.details.entities[chatId]?.members,
    (_, __, excludeSelf?: true) => excludeSelf,
  ],
  (userRecords, membersEntry, excludeSelf) => {
    if (!membersEntry) {
      return []
    }
    console.log('RESELECT MEMBERS')

    return membersEntry.ids
      .map((userId) => {
        const record = userRecords[userId]

        return record.isSelf && excludeSelf ? undefined : record
      })
      .filter(Boolean) as User[]
  }
)
const selectAdmins = createSelector(
  [
    (state: RootState) => state.users.entities,
    (_: RootState, chatId: string) => chatId,
    (state: RootState) => state.chats.details.entities,
  ],
  (userRecords, chatId, chatDetailsRecords) => {
    console.log('RESELECT')
    const adminIds = chatDetailsRecords[chatId]?.adminIds
    if (!adminIds) return []
    return adminIds.map((id) => userRecords[id]).filter(Boolean)
  }
)

const selectMemberById = (
  state: RootState,
  chatId: string,
  userId: string
): ChatMember | undefined =>
  state.chats.details.entities[chatId]?.members.entities[userId]

export const chatsSelectors = {
  ...baseChatsSelectors,
  selectCurrentChat,
  selectByUserId,
  selectChatDetails: baseChatDetailsSelectors.selectById,
  selectMembers,
  selectMemberById,
  selectAdmins,
}
