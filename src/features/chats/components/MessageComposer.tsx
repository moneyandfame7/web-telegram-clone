import {
  ChangeEvent,
  FC,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../../../app/store'
import {messagesThunks} from '../../messages/api'

import {IconButton} from '../../../shared/ui/IconButton/IconButton'
import {messagesSelectors} from '../../messages/state/messages-selectors'

import {messagesActions} from '../../messages/state/messages-slice'
import {Icon} from '../../../shared/ui/Icon/Icon'

import {MessageInput} from '../../messages/components/MessageInput/MessageInput'

import './MessageComposer.scss'
import {insertCursorAtEnd} from '../../../shared/helpers/selection'

interface MessageComposerProps {
  chatId: string
}
export const MessageComposer: FC<MessageComposerProps> = ({chatId}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const messageEditing = useAppSelector((state) =>
    messagesSelectors.selectMessageEditing(state)
  )

  const messageToEdit = useAppSelector(
    (state) => messagesSelectors.selectMessageToEdit(state, chatId),
    (oldValue, newValue) => oldValue?.text === newValue?.text // важливо, щоб не трігерити кожен раз
  )

  const inputRef = useRef<HTMLDivElement>(null)

  const [isMessageSending, setIsMessageSending] = useState(false)
  const [text, setText] = useState('')

  useLayoutEffect(() => {
    setText(messageToEdit?.text ?? '')

    if (messageToEdit) {
      // inputRef.current?.focus()
      setTimeout(() => {
        insertCursorAtEnd(inputRef)
      }, 1)
    }
  }, [messageToEdit])

  const handleSubmit = async () => {
    if (messageEditing.id) {
      console.log('EDIT MESSAGE:)')

      dispatch(
        messagesThunks.editMessage({chatId, id: messageEditing.id, text})
      )
      dispatch(messagesActions.toggleMessageEditing({id: undefined}))
      return
    }

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
    <div className="message-composer">
      <div
        className={`mentioned-message-container${
          messageToEdit ? ' active' : ''
        }`}
      >
        <Icon
          className="mentioned-message-icon"
          name="edit"
          color="primary"
          title="Edit icon"
        />
        <div
          className="mentioned-message"
          onClick={() => {
            console.log('CLICK')
            if (messageToEdit) {
              dispatch(
                messagesThunks.scrollToMessage({
                  chatId,
                  sequenceId: messageToEdit.sequenceId,
                  highlight: true,
                })
              )
            }
          }}
        >
          <div className="mentioned-message-content">
            <p className="mentioned-message-title">Editing</p>
            <p className="mentioned-message-text">{messageToEdit?.text}</p>
          </div>
        </div>

        <IconButton
          className="mentioned-message-icon"
          name="close"
          title="Close toolbar"
          color="primary"
          onClick={() => {
            dispatch(messagesActions.toggleMessageEditing({id: undefined}))
          }}
        />
      </div>
      <div className="flex-row">
        <MessageInput
          inputRef={inputRef}
          value={text}
          onChange={(value) => {
            setText(value)
          }}
        />
        <IconButton
          onClick={handleSubmit}
          name="send"
          title="Send message"
          color="primary"
        />
      </div>
    </div>
  )
}
