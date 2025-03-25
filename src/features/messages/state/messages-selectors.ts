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
    (_: RootState, __: string, messageId: string) => messageId,
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
const selectSelectedIds = (state: RootState) =>
  state.messages.messageSelection.chat.ids
const selectIsSelected =
  /* (state: RootState, id: string) =>
  state.messages.messageSelection.chat.ids.includes(id) */
  createSelector(
    [selectSelectedIds, (_, id: string) => id],
    (selectedIds, id) => selectedIds.includes(id)
  )
const selectIsSelectingActive = (state: RootState) =>
  state.messages.messageSelection.chat.active

const selectMessageToEdit = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
  (state: RootState) => state.messages.messageEditing,
  (messageEntry, editing) => {
    return editing?.id && messageEntry
      ? baseMessagesSelectors.selectById(messageEntry, editing.id)
      : undefined
  }
)

const selectMessageToReply = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
  (state: RootState) => state.messages.messageReplying,
  (messageEntry, replying) => {
    return replying?.id && messageEntry
      ? baseMessagesSelectors.selectById(messageEntry, replying.id)
      : undefined
  }
)

const selectLastMessageLocal = createSelector(
  (state: RootState, chatId: string) => state.messages.byChatId[chatId]?.data,
  (messageEntry) => {
    if (!messageEntry) {
      return
    }
    for (let i = messageEntry.ids.length - 1; i >= 0; i--) {
      const id = messageEntry.ids[i]
      const message = messageEntry.entities[id]

      if (!message?.deleteLocal) {
        return message
      }
    }
  }
)

export const messagesSelectors = {
  ...baseMessagesSelectors,
  selectAll,
  selectById,
  selectBySequenceId,
  selectIsLoading,
  selectMessageEditing,
  selectIsSelected,
  selectIsSelectingActive,
  selectSelectedIds,
  selectMessageToEdit,
  selectMessageToReply,
  selectLastMessageLocal,
}
