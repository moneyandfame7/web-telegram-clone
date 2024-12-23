import {useState, type FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import {useAppDispatch} from '../../app/store'

import {Button} from '../../shared/ui'

import {MessageList} from '../messages/components/MessageList/MessageList'
import {messagesThunks} from '../messages/api'

import {ChatHeader} from './components/ChatHeader/ChatHeader'

import './Chat.scss'

export const Chat: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {chatId} = useParams() as {chatId: string}
  const [isMessageSending, setIsMessageSending] = useState(false)
  const [text, setText] = useState('')

  const handleSendMessage = async () => {
    setIsMessageSending(true)

    try {
      const result = await dispatch(
        messagesThunks.sendMessage({chatId, text})
      ).unwrap()

      if (result.chatJustCreated) {
        navigate(`/${result.chatId}`, {
          // Коли ми відправляємо повідомлення в приватному чаті, спочатку в URL адресі використовується ID формата `u_userId`, а потім, коли на бекенді створююється чат, змінюємо адресу на ID вже реального, існуючого чату
          // використовую replace, щоб не можна було повернутись до url адреси де id користувача використовується
          replace: true,
        })
      }
    } catch (error) {
      console.error('Send message error', error)
    } finally {
      setIsMessageSending(false)
    }
  }

  return (
    <div className="chat">
      <ChatHeader chatId={chatId} />

      <MessageList key={chatId} chatId={chatId} />
      <input
        className="chat-input"
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value)
        }}
      />
      <Button isLoading={isMessageSending} onClick={handleSendMessage}>
        Send message
      </Button>
    </div>
  )
}
