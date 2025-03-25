import {type FC} from 'react'
import {useParams} from 'react-router-dom'

import {MessageList} from '../messages/components/MessageList/MessageList'

import {ChatHeader} from './components/ChatHeader/ChatHeader'

import {MessageComposer} from './components/MessageComposer'
import './Chat.scss'

export const Chat: FC = () => {
  const {chatId} = useParams() as {chatId: string}

  return (
    <div className="chat">
      <ChatHeader chatId={chatId} />
      <MessageList key={chatId} chatId={chatId} />
      <MessageComposer chatId={chatId} />
    </div>
  )
}
