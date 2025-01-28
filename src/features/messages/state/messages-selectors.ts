import {createSelector} from '@reduxjs/toolkit'
import {RootState} from '../../../app/store'
import {messagesAdapter} from './messages-adapter'

const baseMessagesSelectors = messagesAdapter.getSelectors()

const selectAll = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
  (messagesEntry) => {
    return messagesEntry ? baseMessagesSelectors.selectAll(messagesEntry) : []
  }
)

const selectById = createSelector(
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
const selectBySequenceId = createSelector(
  [
    (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
    (_, __, sequenceId: number) => sequenceId,
  ],
  (messageEntry, sequenceId) => {
    if (!messageEntry) {
      return
    }

    const messages = baseMessagesSelectors.selectAll(messageEntry)

    return messages.find((message) => message.sequenceId === sequenceId)
  }
)

const selectIsLoading = (state: RootState, chatId: string) =>
  state.messages.byChatId[chatId]?.isLoading

const selectMessageEditing = (state: RootState) => state.messages.messageEditing

const selectMessageToEdit = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
  (state: RootState) => state.messages.messageEditing,
  (messageEntry, editing) => {
    return editing.id && messageEntry
      ? baseMessagesSelectors.selectById(messageEntry, editing.id)
      : undefined
  }
)

export const messagesSelectors = {
  ...baseMessagesSelectors,
  selectAll,
  selectById,
  selectBySequenceId,
  selectIsLoading,
  selectMessageEditing,
  selectMessageToEdit,
}
