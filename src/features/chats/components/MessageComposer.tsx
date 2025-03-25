import {FC, useLayoutEffect, useRef, useState} from 'react'
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
import {SingleTransition} from '../../../shared/ui/Transition/Transition'
import {Button} from '../../../shared/ui'
import {chatsSelectors} from '../state'
import {DeleteMessagesModal} from '../../messages/components/DeleteMessagesModal/DeleteMessagesModal'
import {useBoolean} from '../../../shared/hooks/useBoolean'
import {MentionedMessage} from '../../messages/components/MentionedMessage/MentionedMessage'

interface MessageComposerProps {
  chatId: string
}
export const MessageComposer: FC<MessageComposerProps> = ({chatId}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const chat = useAppSelector((state) =>
    chatsSelectors.selectById(state, chatId)
  )
  const messageEditing = useAppSelector(messagesSelectors.selectMessageEditing)
  const messageSelection = useAppSelector(
    (state) => state.messages.messageSelection.chat
  )

  const messageToEdit = useAppSelector(
    (state) => messagesSelectors.selectMessageToEdit(state, chatId),
    (oldValue, newValue) => oldValue?.text === newValue?.text // важливо, щоб не трігерити кожен раз
  )

  const messageToReply = useAppSelector((state) =>
    messagesSelectors.selectMessageToReply(state, chatId)
  )

  const inputRef = useRef<HTMLDivElement>(null)

  const {
    value: isDeleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean()

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
        messagesThunks.sendMessage({
          chatId,
          text,
          replyToMsgId: messageToReply?.id,
        })
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
      {/* <div
        className={`message-selection${
          messageSelection.active ? ' active' : ''
        }`}
      >
        <h1>{messageSelection.ids.length}</h1>
      </div> */}
      <SingleTransition
        className="message-selection"
        in={messageSelection.active}
        transitionName="fade"
        animationToggle
      >
        <IconButton
          onClick={() => {
            dispatch(
              messagesActions.toggleChatMessageSelection({active: false})
            )
          }}
          name="close"
          title="Cancel selection"
          color="secondary"
        />
        <p className="text-bold">
          {messageSelection.ids.length} messages selected
        </p>
        <Button
          variant="transparent"
          color="red"
          size="small"
          onClick={openDeleteModal}
        >
          <Icon name="deleteIcon" title="Delete" size="small" color="red" />
          Delete
        </Button>
        <Button variant="transparent" color="gray" size="small">
          Forward
          <Icon name="forward" title="Forward" color="secondary" size="small" />
        </Button>
      </SingleTransition>
      <MentionedMessage
        size="large"
        messageToEdit={messageToEdit}
        replyInfo={messageToReply}
        onClick={() => {
          const message = messageToEdit || messageToReply

          if (!message) {
            return
          }

          dispatch(
            messagesThunks.scrollToMessage({
              chatId: message.chatId,
              sequenceId: message.sequenceId,
              highlight: true,
            })
          )
        }}
        onClose={() => {
          dispatch(messagesActions.toggleMessageEditing({}))
          dispatch(messagesActions.toggleMessageReplying({}))
        }}
      />
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

      {chat && (
        <DeleteMessagesModal
          chat={chat}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  )
}
