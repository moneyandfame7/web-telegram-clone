import {FC} from 'react'

import './MentionedMessage.scss'
import {Message, MessageReplyInfo} from '../../types'
import {Icon} from '../../../../shared/ui/Icon/Icon'
import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {useAppSelector} from '../../../../app/store'
import {usersSelectors} from '../../../users/state/users-selectors'
import {User} from '../../../auth/types'
import {getUserTitle} from '../../../users/helpers'
import clsx from 'clsx'

interface MentionedMessageProps {
  messageToEdit?: Message
  replyInfo?: MessageReplyInfo
  onClick: VoidFunction
  onClose: VoidFunction
  size: 'compact' | 'large'
}
export const MentionedMessage: FC<MentionedMessageProps> = ({
  messageToEdit,
  replyInfo,
  onClick,
  onClose,
  size,
}) => {
  const isReply = Boolean(replyInfo)

  const isActive = Boolean(messageToEdit) || Boolean(replyInfo)

  const message = messageToEdit || replyInfo

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
  return (
    <div className={className}>
      <Icon
        className="mentioned-message-icon"
        name="edit"
        color="primary"
        title="Edit icon"
      />
      <div className="mentioned-message" onClick={onClick}>
        <div className="mentioned-message-content">
          <p className="mentioned-message-title">
            {messageToEdit
              ? 'Editing'
              : replyInfo && sender
              ? size === 'large'
                ? `Reply to ${getUserTitle(sender)}`
                : `${getUserTitle(sender)}`
              : ''}
          </p>
          <p className="mentioned-message-text">{message?.text}</p>
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
