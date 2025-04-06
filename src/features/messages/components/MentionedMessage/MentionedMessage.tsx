import React, {FC, RefObject} from 'react'

import './MentionedMessage.scss'
import {ForwardMessages, Message, MessageReplyInfo} from '../../types'
import {Icon} from '../../../../shared/ui/Icon/Icon'
import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {useAppSelector} from '../../../../app/store'
import {usersSelectors} from '../../../users/state/users-selectors'
import {User} from '../../../auth/types'
import {getUserTitle} from '../../../users/helpers'
import clsx from 'clsx'
import {chatsSelectors} from '../../../chats/state'
import {Chat} from '../../../chats/types'

interface MentionedMessageProps {
  messageToEdit?: Message
  replyInfo?: MessageReplyInfo
  forwardMessages?: ForwardMessages
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
  onClose: VoidFunction
  size: 'compact' | 'large'
}
export const MentionedMessage: FC<MentionedMessageProps> = ({
  messageToEdit,
  replyInfo,
  forwardMessages,
  onClick,
  onClose,
  size,
}) => {
  const isReply = Boolean(replyInfo)

  const isActive =
    Boolean(messageToEdit) || Boolean(replyInfo) || Boolean(forwardMessages)

  const message = messageToEdit || replyInfo
  const forwardFromChat = useAppSelector((state) =>
    chatsSelectors.selectById(state, forwardMessages?.fromChatId ?? '')
  ) as Chat | undefined
  const sender = useAppSelector((state) =>
    usersSelectors.selectById(
      state,
      isReply ? replyInfo!.senderId : messageToEdit?.senderId ?? ''
    )
  ) as User | undefined

  const className = clsx('mentioned-message-container', {
    active: isActive,
    compact: size === 'compact',
  })

  function getTitle() {
    if (messageToEdit) {
      return 'Editing'
    } else if (replyInfo && sender) {
      return size === 'large'
        ? `Reply to ${getUserTitle(sender)}`
        : `${getUserTitle(sender)}`
    } else if (forwardMessages) {
      return `${forwardFromChat?.title} ${
        forwardMessages.noAuthor ? "(sender's name hidden)" : ''
      }`
    }
  }

  function getSubtitle() {
    if (forwardMessages) {
      return `${forwardMessages.messageIds.length} forwarded messages`
    }
    return message?.text
  }
  return (
    <div /* ref={ref} */ className={className}>
      <Icon
        className="mentioned-message-icon"
        name="edit"
        color="primary"
        title="Edit icon"
      />
      <div className="mentioned-message" onClick={onClick}>
        <div className="mentioned-message-content">
          <p className="mentioned-message-title">{getTitle()}</p>
          <p className="mentioned-message-text">{getSubtitle()}</p>
        </div>
      </div>

      <IconButton
        className="mentioned-message-icon"
        name="close"
        title="Close toolbar"
        color="primary"
        onClick={onClose}
      />
    </div>
  )
}
