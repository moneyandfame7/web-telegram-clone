import {messagesActions} from './../state/messages-slice'
import {useEffect, useRef} from 'react'
import {VirtualizerHandle} from 'virtua'

import {useAppDispatch, useAppSelector} from '../../../app/store'
import {addListener} from '@reduxjs/toolkit'
import {messagesThunks} from '../api'
import {GetMessagesDirection, Message} from '../types'
import {selectMessages} from '../state/messages-selectors'

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
    const unsubscribeHighlightMessage = dispatch(
      addListener({
        actionCreator: messagesThunks.highlightMessage.fulfilled,
        effect: (action, api) => {
          const index = messagesRef.current.findIndex(
            (message) => message.sequenceId === action.payload
          )
          const message = messagesRef.current[index]
          virtua.current?.scrollToIndex(index, {align: 'start'})

          const offset = virtua.current?.getItemOffset(index)
          const size = virtua.current?.getItemSize(index)
          if (offset !== undefined && size !== undefined) {
            /**
             * @todo це буде працювати адекватно тільки якщо скролимо вверх, а не вниз
             */
            console.log(virtua.current?.viewportSize)
            // virtua.current?.scrollToIndex(index, {
            //   align: 'start',
            //   offset: virtua.current.viewportSize / 2,
            // })
            virtua.current?.scrollTo(offset + size)
          }

          setTimeout(() => {
            virtua.current?.scrollToIndex(index, {
              align: 'center',
              smooth: true,
            })
          }, 0)
          // }
          setTimeout(() => {
            api.dispatch(
              messagesActions.editMessage({
                id: message.id,
                chatId,
                changes: {isHighlighted: true},
              })
            )
          }, 0)

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
      unsubscribeHighlightMessage({
        cancelActive: true,
      })
    }
  }, [dispatch, chatId])

  return {virtua, endFetchedCountRef, startFetchedCountRef}
}
