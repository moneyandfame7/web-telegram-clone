import {createSelector} from '@reduxjs/toolkit'
import {RootState} from '../../../app/store'
import {chatsAdapter} from './chats-adapter'

const baseChatsSelectors = chatsAdapter.getSelectors<RootState>(
  (state) => state.chats
)

export const selectByUserId = createSelector(
  [baseChatsSelectors.selectAll, (state: RootState, userId: string) => userId],
  (chats, userId) => {
    return chats.find((chat) => chat.userId === userId)
  }
)

export const chatsSelectors = {
  ...baseChatsSelectors,
  selectByUserId,
}
