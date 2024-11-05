import {FC, useEffect, useRef} from 'react'
import {useAppSelector} from '../../../../app/store'
import {selectMessages} from '../../state/messages-selectors'
import {Message} from '../Message/Message'

import './MessageList.scss'
interface MessageListProps {
  chatId: string
}
export const MessageList: FC<MessageListProps> = ({chatId}) => {
  const messageListRef = useRef<HTMLDivElement>(null)
  const messages = useAppSelector((state) => selectMessages(state, chatId))

  const renderList = () => {
    if (messages.length === 0) {
      return <h1>No Messages!</h1>
    }

    return messages.map((message) => (
      <Message message={message} key={message.id} />
    ))
  }

  useEffect(() => {
    console.log('messages changes')

    messageListRef.current?.scrollTo({
      behavior: 'smooth',
      top: messageListRef.current.scrollHeight,
    })
  }, [messages])

  return (
    <div className="message-list" ref={messageListRef}>
      {renderList()}
    </div>
  )
}
