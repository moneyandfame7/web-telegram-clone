import {FC} from 'react'

import {Chat} from '../../types'

import './ChatItem.scss'

interface ChatItemProps {
  chat: Chat
  onSelect: (chatId: string) => void
}
export const ChatItem: FC<ChatItemProps> = ({chat, onSelect}) => {
  return (
    <div
      className="chat-item"
      onClick={(e) => {
        onSelect(chat.id)
      }}
    >
      <div className="avatar">{chat.title[0]}</div>
      <div className="chat-item__info">
        <div className="chat-item__row">
          <p className="chat-item__title">{chat.title}</p>
          <p className="chat-item__date">Thu</p>
        </div>
        <div className="chat-item__row">
          <span className="chat-item__message">
            Lorem ipsum dorem loejrjqjwerjqwejrjqwerjqjjqwejrqwjer
          </span>
          <p className="chat-item__count">7</p>
        </div>
      </div>
    </div>
  )
}
