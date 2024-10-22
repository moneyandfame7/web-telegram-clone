import type {FC} from 'react'
import {useParams} from 'react-router-dom'
import {useAppSelector} from '../../app/store'
import {chatsSelectors} from './chats-slice'

export const Chat: FC = () => {
  const {chatId} = useParams()
  const chat = useAppSelector((state) =>
    chatsSelectors.selectById(state, chatId!)
  )

  return (
    <div className="chat">
      <h1>{chatId}</h1>

      <h1>{chat.title}</h1>
    </div>
  )
}
