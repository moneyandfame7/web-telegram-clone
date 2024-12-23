import {messagesActions} from './../state/messages-slice'
import {useEffect, useRef} from 'react'
import {VirtualizerHandle} from 'virtua'

import {useAppDispatch, useAppSelector} from '../../../app/store'
import {addListener} from '@reduxjs/toolkit'
import {messagesThunks} from '../api'
import {GetMessagesDirection, Message} from '../types'
import {selectMessages} from '../state/messages-selectors'
import {inRange} from '../../../shared/helpers/inRange'

export const useConnetedVirtuaRef = ({chatId}: {chatId: string}) => {
  const dispatch = useAppDispatch()
  const messagesRef = useRef<Message[]>([])
  const messages = useAppSelector((state) => selectMessages(state, chatId))
  const virtua = useRef<VirtualizerHandle>(null)
  const isMounted = useRef(false)
  const startFetchedCountRef = useRef(-1)
  const endFetchedCountRef = useRef(-1)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    if (isMounted.current) {
      return
    }
    isMounted.current = true

    const unsubscribeGetMessages = dispatch(
      addListener({
        actionCreator: messagesThunks.getMessages.fulfilled,
        effect: (action) => {
          if (action.meta.arg.direction === GetMessagesDirection.AROUND) {
            endFetchedCountRef.current = -1
            startFetchedCountRef.current = -1
          }
        },
      })
    )

    const unsubscribeScrollToMessage = dispatch(
      addListener({
        actionCreator: messagesThunks.scrollToMessage.fulfilled,
        effect: (action, api) => {
          if (!virtua.current) {
            return
          }
          const {sequenceId, replaceList, highlight} = action.payload

          const index = messagesRef.current.findIndex(
            (message) => message.sequenceId === sequenceId
          )
          const message = messagesRef.current[index]
          const firstVisibleMessage =
            messagesRef.current[virtua.current.findStartIndex()]
          const lastVisibleMessage =
            messagesRef.current[virtua.current.findEndIndex()]

          if (replaceList) {
            /**
             * @TODO animate scroll here
             */
            virtua.current?.scrollToIndex(index, {
              align: 'center',
            })
          } else {
            const size = virtua.current.getItemSize(index)
            const averageId =
              (firstVisibleMessage.sequenceId + lastVisibleMessage.sequenceId) /
              2

            if (
              !inRange(sequenceId, [
                firstVisibleMessage.sequenceId,
                lastVisibleMessage.sequenceId,
              ])
            ) {
              virtua.current.scrollToIndex(index, {
                align: sequenceId > averageId ? 'end' : 'start',
                offset: sequenceId > averageId ? -(size * 2) : size * 2,
              })
            }

            setTimeout(() => {
              virtua.current?.scrollToIndex(index, {
                align: 'center',
                smooth: true,
              })
            }, 0)
          }

          if (!highlight) {
            return
          }

          api.dispatch(
            messagesActions.editMessage({
              id: message.id,
              chatId,
              changes: {isHighlighted: true},
            })
          )

          setTimeout(() => {
            api.dispatch(
              messagesActions.editMessage({
                id: message.id,
                chatId,
                changes: {isHighlighted: false},
              })
            )
          }, 800)
        },
      })
    )

    return () => {
      unsubscribeGetMessages()
      unsubscribeScrollToMessage({
        cancelActive: true,
      })
    }
  }, [/* dispatch,  */ chatId])

  return {virtua, endFetchedCountRef, startFetchedCountRef}
}
