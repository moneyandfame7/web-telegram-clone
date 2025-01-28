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

import './Message.scss'

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

  const ref = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

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

  const buildedClass = clsx('message', {
    outgoing: message.isOutgoing,
    incoming: !message.isOutgoing,
    highlighted: message.isHighlighted,
    'last-in-group': isLastInGroup,
    'first-in-group': isFirstInGroup,
    'menu-open': isContextMenuOpen,
  })

  return (
    <div className={buildedClass} ref={ref} onContextMenu={handleContextMenu}>
      {!message.isOutgoing && isLastInGroup && (
        <Avatar
          color={sender?.color}
          title={sender ? getUserTitle(sender) : undefined}
          size="extra-small"
        />
      )}

      <div className="message-content">
        <div className="message-content__sender"></div>
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
        <MenuItem title="Reply" icon="reply" />
        <MenuItem
          title="Edit"
          icon="edit"
          onClick={() => {
            dispatch(messagesActions.toggleMessageEditing({id: message.id}))
          }}
        />
        <MenuItem title="Copy" icon="copy" />
        <MenuItem title="Delete" icon="deleteIcon" danger />
      </Menu>
    </div>
  )
}
