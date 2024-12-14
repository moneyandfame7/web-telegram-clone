import {createSelector} from '@reduxjs/toolkit'
import {RootState} from '../../../app/store'
import {messagesAdapter} from './messages-adapter'

const baseMessagesSelectors = messagesAdapter.getSelectors()

export const selectMessages = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
  (messagesEntry) => {
    return messagesEntry ? baseMessagesSelectors.selectAll(messagesEntry) : []
  }
)

export const selectMessageById = createSelector(
  [
    (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
    (state: RootState, chatId: string, messageId: string) => messageId,
  ],
  (messagesEntry, messageId) => {
    return messagesEntry
      ? baseMessagesSelectors.selectById(messagesEntry, messageId)
      : undefined
  }
)
export const selectMessageBySequenceId = createSelector(
  [
    (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
    (state: RootState, chatId: string, sequenceId: number) => sequenceId,
  ],
  (messageEntry, sequenceId) => {
    if (!messageEntry) {
      return
    }

    const messages = baseMessagesSelectors.selectAll(messageEntry)

    return messages.find((message) => message.sequenceId === sequenceId)
  }
)
export const selectIsMessagesLoading = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId],
  (messagesList) => messagesList?.isLoading
)

export const selectMessageList = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId],
  (messageList) => messageList
)

export const selectMessageListKey = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId],
  (messageList) => messageList?.dataSetKey
)
