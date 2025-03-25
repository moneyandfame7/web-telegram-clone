import {FC, useRef} from 'react'

import {Message as MessageType} from '../../types'
import clsx from 'clsx'
import {useAppDispatch, useAppSelector} from '../../../../app/store'
import {User} from '../../../auth/types'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'
import {getUserTitle} from '../../../users/helpers'

import {MessageInfo} from '../MessageInfo/MessageInfo'
import {chatsSelectors} from '../../../chats/state'
import {Chat} from '../../../chats/types'
import {usersSelectors} from '../../../users/state/users-selectors'
import {useContextMenu} from '../../../../shared/hooks/useContextMenu'
import {Menu} from '../../../../shared/ui/Menu/Menu'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'
import {messagesActions} from '../../state/messages-slice'

import {messagesSelectors} from '../../state/messages-selectors'

import './Message.scss'
import {Icon} from '../../../../shared/ui/Icon/Icon'
import {DeleteMessagesModal} from '../DeleteMessagesModal/DeleteMessagesModal'
import {useBoolean} from '../../../../shared/hooks/useBoolean'
import {MentionedMessage} from '../MentionedMessage/MentionedMessage'
import {messagesThunks} from '../../api'

interface MessageProps {
  message: MessageType
  isLastInGroup: boolean
  isFirstInGroup: boolean
}
export const Message: FC<MessageProps> = ({
  message,
  isLastInGroup,
  isFirstInGroup,
}) => {
  const dispatch = useAppDispatch()

  const chat = useAppSelector((state) =>
    chatsSelectors.selectById(state, message.chatId)
  ) as Chat | undefined
  const sender = useAppSelector((state) =>
    usersSelectors.selectById(state, message.senderId)
  ) as User | undefined
  const isSelectionActive = useAppSelector(
    messagesSelectors.selectIsSelectingActive
  )
  const isMessageSelected = useAppSelector((state) =>
    messagesSelectors.selectIsSelected(state, message.id)
  )
  const isPrivateChat = Boolean(chat?.userId)

  const shouldShowSenderName = !isPrivateChat && !message.isOutgoing

  const ref = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const {
    value: isDeleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean()

  const {isContextMenuOpen, handleContextMenu, handleContextMenuClose, styles} =
    useContextMenu({
      menuRef,
      triggerRef: ref,
      getMenuElement: () => {
        return document
          .querySelector('#portal')
          ?.querySelector('.message-context-menu') as HTMLDivElement | null
      },
    })

  const handleClick = () => {
    if (isSelectionActive) {
      dispatch(
        messagesActions.toggleChatMessageSelection({
          id: message.id,
          active: true,
        })
      )
    }
  }

  const buildedClass = clsx('message', {
    outgoing: message.isOutgoing,
    incoming: !message.isOutgoing,
    highlighted: message.isHighlighted,
    'last-in-group': isLastInGroup,
    'first-in-group': isFirstInGroup,
    'menu-open': isContextMenuOpen,
    'is-selected': isMessageSelected,
  })

  return (
    <div
      className={buildedClass}
      ref={ref}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {/* {isSelectionActive && ( */}
      <div className="message-checkbox">
        <Icon name="check" title="Select message" size="small" color="white" />
      </div>
      {/* )} */}
      {!message.isOutgoing && isLastInGroup && (
        <Avatar
          color={sender?.color}
          title={sender ? getUserTitle(sender) : undefined}
          size="extra-small"
        />
      )}

      <div className="message-content">
        {shouldShowSenderName && (
          <div className="message-content__sender">SENDER</div>
        )}
        {message.replyInfo && (
          <MentionedMessage
            size="compact"
            replyInfo={message.replyInfo}
            onClick={() => {
              const replyInfo = message.replyInfo!
              dispatch(
                messagesThunks.scrollToMessage({
                  chatId: message.chatId,
                  sequenceId: replyInfo.sequenceId,
                  highlight: true,
                })
              )
            }}
            onClose={() => {
              dispatch(messagesActions.toggleMessageEditing({}))
              dispatch(messagesActions.toggleMessageReplying({}))
            }}
          />
        )}
        <div className="message-content__text">
          <b>[{message.sequenceId}] </b>
          LAST READ: {`${chat?.theirLastReadMessageSequenceId}   `}
          {message.text}
          <MessageInfo
            message={message}
            isUnread={
              (chat?.theirLastReadMessageSequenceId ?? -1) < message.sequenceId
            }
          />
        </div>
        {isLastInGroup && (
          <svg
            viewBox="0 0 11 20"
            width="11"
            height="20"
            className="message-arrow"
          >
            <g transform="translate(9 -14)" fill="inherit" fillRule="evenodd">
              <path
                d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z"
                transform="matrix(1 0 0 -1 0 49)"
                id="corner-fill"
                fill="inherit"
              />
            </g>
          </svg>
        )}
      </div>

      <Menu
        unmount
        className="message-context-menu"
        elRef={menuRef}
        isOpen={isContextMenuOpen}
        handleAwayClick={true}
        onClose={handleContextMenuClose}
        style={styles}
        portal
        backdrop
      >
        <MenuItem
          title="Reply"
          icon="reply"
          onClick={() => {
            console.log(`REPLY: ${message.id}`)
            dispatch(messagesActions.toggleMessageReplying({id: message.id}))
          }}
        />
        <MenuItem
          title="Edit"
          icon="edit"
          onClick={() => {
            dispatch(messagesActions.toggleMessageEditing({id: message.id}))
          }}
        />
        <MenuItem title="Copy" icon="copy" />
        <MenuItem
          title="Select"
          icon="select"
          onClick={() => {
            dispatch(
              messagesActions.toggleChatMessageSelection({
                active: true,
                id: message.id,
              })
            )
          }}
        />
        <MenuItem
          title="Delete"
          icon="deleteIcon"
          danger
          onClick={openDeleteModal}
        />
      </Menu>

      {chat && (
        <DeleteMessagesModal
          chat={chat}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          message={message}
        />
      )}
    </div>
  )
}
