import {useState, type FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import {useAppDispatch, useAppSelector} from '../../app/store'
import {emitEventWithHandling, socket} from '../../app/socket'

import {Button} from '../../shared/ui'

import {messagesActions} from '../messages/state/messages-slice'
import {MessageList} from '../messages/components/MessageList/MessageList'
import {Message} from '../messages/types'

import {ChatHeader} from './components/ChatHeader/ChatHeader'

import {Chat as ChatType, SendMessageParams} from './types'

import './Chat.scss'
import {chatsActions, chatsSelectors} from './state'

export const Chat: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {chatId} = useParams() as {chatId: string}
  const [isMessageSending, setIsMessageSending] = useState(false)
  const [text, setText] = useState('')
  const chat = useAppSelector((state) =>
    chatsSelectors.selectById(state, chatId)
  )
  const handleSendMessage = async () => {
    setIsMessageSending(true)

    try {
      const result = await emitEventWithHandling<
        SendMessageParams,
        {chat: ChatType; message: Message}
      >('sendMessage', {
        chatId: chatId,
        text,
      })
      dispatch(
        messagesActions.addMessage({
          chatId: result.chat.id,
          message: result.message,
        })
      )
      if (!chat) {
        dispatch(chatsActions.addOne(result.chat))
        socket.emit('join', `chat-${result.chat.id}`)
        navigate(`/${result.chat.id}`, {
          // Коли ми відправляємо повідомлення в приватному чаті, спочатку в URL адресі використовується ID формата `u_userId`, а потім, коли на бекенді створююється чат, змінюємо адресу на ID вже реального, існуючого чату
          // використовую replace, щоб не можна було повернутись до url адреси де id користувача використовується
          replace: true,
        })
        // dispatch(chatsActions.setCurrentChat(result.chat.id))
      } else {
        dispatch(
          chatsActions.updateOne({
            id: result.chat.id,
            changes: {
              lastMessage: result.chat.lastMessage,
            },
          })
        )
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
