import {FC, startTransition, useEffect, useRef, useState} from 'react'

import {Virtualizer} from 'virtua'

import {useAppDispatch, useAppSelector} from '../../../../app/store'
import {emitEventWithHandling} from '../../../../app/socket'

import {chatsActions, chatsSelectors} from '../../../chats/state'
import {useConnetedVirtuaRef} from '../../hooks/useConnectedVirtuosoRef'
import {throttle} from '../../../../shared/helpers/throttle'
import {Chat} from '../../../chats/types'
import {IconButton} from '../../../../shared/ui/IconButton/IconButton'

import {
  GetMessagesDirection,
  GetMessagesParams,
  ReadHistoryParams,
  ReadMyHistoryResult,
} from '../../types'
import {messagesSelectors} from '../../state/messages-selectors'
import {messagesThunks} from '../../api'
import {Message} from '../Message/Message'

import './MessageList.scss'

const SPINNER_HEIGHT = 40
interface MessageListProps {
  chatId: string
}

const readHistoryThrottled = throttle((cb) => cb(), 250, false)

export const MessageList: FC<MessageListProps> = ({chatId}) => {
  const chat = useAppSelector((state) =>
    chatsSelectors.selectById(state, chatId)
  ) as Chat | undefined
  const messages = useAppSelector((state) =>
    messagesSelectors.selectAll(state, chatId)
  )

  const dispatch = useAppDispatch()

  const [shifting, setShifting] = useState(false)
  const [startFetching, setStartFetching] = useState(false)
  const [endFetching, setEndFetching] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const fetchMoreMessages = async (params: GetMessagesParams) => {
    setShifting(params.direction === GetMessagesDirection.OLDER)

    const setFetching =
      params.direction === GetMessagesDirection.OLDER
        ? setStartFetching
        : setEndFetching

    setFetching(true)
    await dispatch(messagesThunks.getMessages(params)).unwrap()
    setFetching(false)
  }

  const {virtua, endFetchedCountRef, startFetchedCountRef} =
    useConnetedVirtuaRef({chatId})
  const THRESHOLD = 5
  const count = messages.length

  const ready = useRef(false)

  useEffect(() => {
    if (!virtua.current) {
      return
    }

    if (virtua.current.scrollSize > virtua.current.viewportSize) {
      return
    }

    void readHistoryThrottled(async () => {
      if (!virtua.current) {
        return
      }
      const startIndex = virtua.current.findStartIndex()
      const endIndex = virtua.current.findEndIndex()

      console.log({endIndex})

      let newMyLastReadMessage

      for (let i = endIndex; i >= startIndex; i--) {
        const message = messages[i]

        if (message && !message.isOutgoing) {
          newMyLastReadMessage = message
          break // Зупиняємо пошук, якщо знайдено крайнє повідомлення
        }
      }
      if (!newMyLastReadMessage) {
        return
      }

      if (
        (chat?.myLastReadMessageSequenceId ?? 0) <
        newMyLastReadMessage.sequenceId
      ) {
        console.log(
          `SHOULD READ THIS MESSAGE`,
          newMyLastReadMessage.sequenceId,
          chat?.myLastReadMessageSequenceId
        )

        const result = await emitEventWithHandling<
          ReadHistoryParams,
          ReadMyHistoryResult
        >('readHistory', {chatId, maxId: newMyLastReadMessage.sequenceId})

        dispatch(
          chatsActions.updateOne({
            id: result.chatId,
            changes: {
              myLastReadMessageSequenceId: result.maxId,
              unreadCount: result.unreadCount,
            },
          })
        )
      }
    })
  }, [messages])

  useEffect(() => {
    console.log(
      `ОСТАННЄ ПРОЧИТАНЕ МОЄ ПОВІДОМЛЕННЯ В ЧАТІ: ${chat?.theirLastReadMessageSequenceId}`
    )

    console.log(
      `ОСТАННЄ ПРОЧИТАНЕ МНОЮ ПОВІДОМЛЕННЯ В ЧАТІ: ${chat?.myLastReadMessageSequenceId}`
    )
    ;(async () => {
      if (!chat) {
        return
      }
      const messages = await dispatch(
        messagesThunks.getMessages({
          chatId,
          sequenceId: chat.myLastReadMessageSequenceId ?? 0,
          direction: GetMessagesDirection.AROUND,
          limit: 40,
        })
      ).unwrap()
      // const indexToScroll = Math.round((messages.length - 1) / 2)

      const index = messages.length / 2 + 1
      // virtua.current?.scrollToIndex(index, {align: 'start'})
      console.log({index})

      /**
       * ця штука допомагає не трігерити onScroll евент після того як я початково проскролив
       */
      setTimeout(() => {
        ready.current = true
      }, 0)
    })()
  }, [])

  const handleScroll = async () => {
    if (!ready.current) return
    startTransition(() => {
      if (!virtua.current) {
        return
      }

      setIsAtBottom(
        virtua.current.scrollOffset -
          virtua.current.scrollSize +
          virtua.current.viewportSize >=
          -1.5
      )
    })

    if (!virtua.current) return

    const isEndReached = virtua.current.findEndIndex() + THRESHOLD > count
    const hasMoreEnd = endFetchedCountRef.current < count

    const isStartReached = virtua.current.findStartIndex() - THRESHOLD < 0
    const hasMoreStart = startFetchedCountRef.current < count
    if (isStartReached && hasMoreStart) {
      startFetchedCountRef.current = count
      const triggerMessage = messages[0]
      if (
        !triggerMessage ||
        triggerMessage.sequenceId === chat?.firstMessageSequenceId
      ) {
        return
      }

      // if (triggerMessage.sequenceId === chat?.firstMessageSequenceId)
      console.log('HAS OLDER')
      console.log(`Trigger message: ${triggerMessage.sequenceId}`)

      await fetchMoreMessages({
        chatId,
        sequenceId: triggerMessage.sequenceId,
        direction: GetMessagesDirection.OLDER,
      })
    } else if (isEndReached && hasMoreEnd) {
      endFetchedCountRef.current = count
      const triggerMessage = messages[messages.length - 1]
      if (
        !triggerMessage ||
        triggerMessage.sequenceId === chat?.lastMessage?.sequenceId
      ) {
        return
      }

      console.log('HAS NEWER')
      console.log(`Trigger message: ${triggerMessage.sequenceId}`)

      await fetchMoreMessages({
        chatId,
        sequenceId: triggerMessage.sequenceId,
        direction: GetMessagesDirection.NEWER,
      })
    }

    void readHistoryThrottled(async () => {
      if (!virtua.current) {
        return
      }
      const startIndex = virtua.current.findStartIndex()
      const endIndex = virtua.current.findEndIndex()

      console.log({endIndex})

      let newMyLastReadMessage

      for (let i = endIndex; i >= startIndex; i--) {
        const message = messages[i]

        if (message && !message.isOutgoing) {
          newMyLastReadMessage = message
          break // Зупиняємо пошук, якщо знайдено крайнє повідомлення
        }
      }
      if (!newMyLastReadMessage) {
        return
      }

      if (
        (chat?.myLastReadMessageSequenceId ?? 0) <
        newMyLastReadMessage.sequenceId
      ) {
        console.log(
          `SHOULD READ THIS MESSAGE`,
          newMyLastReadMessage.sequenceId,
          chat?.myLastReadMessageSequenceId
        )

        const result = await emitEventWithHandling<
          ReadHistoryParams,
          ReadMyHistoryResult
        >('readHistory', {chatId, maxId: newMyLastReadMessage.sequenceId})

        dispatch(
          chatsActions.updateOne({
            id: result.chatId,
            changes: {
              myLastReadMessageSequenceId: result.maxId,
              unreadCount: result.unreadCount,
            },
          })
        )
      }
    })
  }

  /**
   * @todo spinner height + лоадер на початку треба робити hidden можливо, я точно не шарю треба розібратись.
   * якщо прибирати startMargin - немає ніяких проблем з мерехтінням
   */
  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        overflowAnchor: 'none',
        // padding: '20px',
      }}
    >
      {/* {startFetching && <Spinner />} */}
      <Virtualizer
        key={chatId}
        ref={virtua}
        shift={shifting ? true : false}
        // startMargin={SPINNER_HEIGHT}
        onScroll={handleScroll}
        count={messages.length}
      >
        {(index) => {
          const message = messages[index]
          return <Message key={message.sequenceId} message={message} />
        }}
      </Virtualizer>
      {/* {endFetching && <Spinner />} */}
      {!isAtBottom && (
        <IconButton
          name="chevronDown"
          title="Scroll to bottom"
          variant="primary"
          color="white"
          size="large"
          style={{
            position: 'absolute',
            bottom: 100,
            right: 15,
          }}
          onClick={() => {
            // console.log(virtua.current?.findEndIndex())
            // const sequenceId = !Math.round(Math.random())
            //   ? chat?.lastMessage?.sequenceId
            //   : 14
            dispatch(
              messagesThunks.scrollToMessage({
                chatId,
                sequenceId: chat?.lastMessage?.sequenceId!,
                highlight: false,
              })
            )
          }}
        />
      )}
      <IconButton
        name="eyeOpen"
        title="Scroll to bottom"
        variant="primary"
        color="white"
        size="large"
        style={{
          position: 'absolute',
          bottom: 150,
          right: 15,
        }}
        onClick={() => {
          // console.log(virtua.current?.findEndIndex())
          // const sequenceId = !Math.round(Math.random())
          //   ? chat?.lastMessage?.sequenceId
          //   : 14
          dispatch(
            messagesThunks.scrollToMessage({
              chatId,
              sequenceId: 14,
              highlight: true,
            })
          )
        }}
      />
      {/* )} */}
    </div>
  )
}
