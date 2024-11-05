import {createSelector} from '@reduxjs/toolkit'
import {RootState} from '../../../app/store'
import {messagesAdapter} from './messages-adapter'

const baseMessagesSelectors = messagesAdapter.getSelectors()

export const selectMessages = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId],
  (messagesEntry) => {
    return messagesEntry ? baseMessagesSelectors.selectAll(messagesEntry) : []
  }
)

export const selectMessageById = createSelector(
  [
    (state: RootState, chatId: string) => state.messages.byChatId[chatId],
    (state: RootState, chatId: string, messageId: string) => messageId,
  ],
  (messagesEntry, messageId) => {
    return messagesEntry
      ? baseMessagesSelectors.selectById(messagesEntry, messageId)
      : undefined
  }
)
