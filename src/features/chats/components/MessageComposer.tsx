import {FC, useLayoutEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {store, useAppDispatch, useAppSelector} from '../../../app/store'
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
import {ReceiverPicker} from '../../../shared/ui/ReceiverPicker/ReceiverPicker'
import {Menu} from '../../../shared/ui/Menu/Menu'
import {useContextMenu} from '../../../shared/hooks/useContextMenu'
import {MenuItem} from '../../../shared/ui/Menu/MenuItem'
import {Message} from '../../messages/types'

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

  const forwardMessages = useAppSelector(
    (state) => state.messages.forwardMessages
  )

  const inputRef = useRef<HTMLDivElement>(null)

  const {
    value: isDeleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean()

  const {
    value: isReceiverPickerOpen,
    setTrue: openReceiverPicker,
    setFalse: closeReceiverPicker,
  } = useBoolean()

  const ref = useRef<HTMLDivElement>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  const {isContextMenuOpen, handleContextMenu, handleContextMenuClose, styles} =
    useContextMenu({
      menuRef,
      triggerRef: ref,
      getMenuElement: () => {
        return document
          .querySelector('#portal')
          ?.querySelector('.message-composer-menu') as HTMLDivElement | null
      },
    })

  // const [isMessageSending, setIsMessageSending] = useState(false)
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

    // setIsMessageSending(true)
    try {
      if (text) {
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
        setText('')
        dispatch(messagesActions.toggleMessageReplying({id: undefined}))
      }
      if (forwardMessages) {
        dispatch(messagesActions.setForwardMessages(null))

        const sortedIds = forwardMessages.messageIds
          .map((id) => {
            return messagesSelectors.selectById(
              store.getState(),
              forwardMessages.fromChatId,
              id
            ) as Message
          })
          .sort((a, b) => a.sequenceId - b.sequenceId)
          .map((m) => m.id)
        const result = await dispatch(
          messagesThunks.forwardMessages({
            toChatId: chatId,
            fromChatId: forwardMessages.fromChatId,
            ids: sortedIds,
            noAuthor: forwardMessages.noAuthor,
          })
        ).unwrap()
        if (result.chatJustCreated) {
          navigate(`/${result.chatId}`, {
            replace: true,
          })
        }
      }
    } catch (error) {
      console.error('Send message error', error)
    }
  }

  return (
    <div className="message-composer" ref={ref}>
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
        <Button
          variant="transparent"
          color="gray"
          size="small"
          onClick={openReceiverPicker}
        >
          Forward
          <Icon name="forward" title="Forward" size="small" />
        </Button>
      </SingleTransition>
      <MentionedMessage
        size="large"
        messageToEdit={messageToEdit}
        replyInfo={messageToReply}
        forwardMessages={forwardMessages}
        onClick={(e) => {
          if (forwardMessages) {
            handleContextMenu(e)

            return
          }
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
          dispatch(messagesActions.setForwardMessages(null))
        }}
      />
      <Menu
        className="message-composer-menu"
        onClose={handleContextMenuClose}
        style={styles}
        isOpen={isContextMenuOpen}
        elRef={menuRef}
        unmount
        handleAwayClick
        portal
        backdrop
      >
        <MenuItem
          title="Show Sender's name"
          closeOnClick={false}
          onClick={() => {
            dispatch(messagesActions.setForwardNoAuthor(false))
          }}
          icon={forwardMessages?.noAuthor ? 'placeholder' : 'check'}
        />
        <MenuItem
          title="Hide Sender's name"
          closeOnClick={false}
          onClick={() => {
            dispatch(messagesActions.setForwardNoAuthor(true))
          }}
          icon={forwardMessages?.noAuthor ? 'check' : 'placeholder'}
        />

        <div className="menu__separator" />

        <MenuItem
          title="Forward to Another Chat"
          onClick={openReceiverPicker}
          icon="replace"
        />

        <MenuItem
          danger
          title="Do Not Forward"
          onClick={() => {
            dispatch(messagesActions.setForwardMessages(null))
          }}
          icon="deleteIcon"
        />

        {/* {children} */}
      </Menu>
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
      <ReceiverPicker
        isOpen={isReceiverPickerOpen}
        onClose={closeReceiverPicker}
        onSelect={(receiverId) => {
          console.log({receiverId, messageSelection})
          dispatch(
            messagesActions.setForwardMessages({
              fromChatId: chatId,
              messageIds: messageSelection.ids,
            })
          )
          dispatch(messagesActions.toggleChatMessageSelection({active: false}))

          if (receiverId !== chatId) {
            navigate(`/${receiverId}`)
          }
        }}
        placeholder="Forward to..."
      />
    </div>
  )
}
