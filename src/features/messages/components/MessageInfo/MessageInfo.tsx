import {FC} from 'react'
import {Message} from '../../types'
import {formatMessageTime} from '../../helpers'
import {Icon} from '../../../../shared/ui/Icon/Icon'

import './MessageInfo.scss'
interface MessageInfoProps {
  message: Message
  isUnread: boolean
}
export const MessageInfo: FC<MessageInfoProps> = ({message, isUnread}) => {
  const sendingDate = formatMessageTime(new Date(message.createdAt), false)
  const isEdited = Boolean(message.editedAt)

  function renderMessageStatus() {
    if (isUnread) {
      return (
        <Icon
          className="message-info__icon"
          name="check1"
          title="Unread icon"
        />
      )
    }
    return (
      <Icon className="message-info__icon" name="checks2" title="Unread icon" />
    )
  }
  return (
    <span className="message-info">
      {isEdited && <i className="message-info__item">edited</i>}

      {/* it's a «fake» element */}
      {/* <span className="message-info__item">{sendingDate}</span>

      {message.isOutgoing && (
        <span className="message-info__item message-info__views">
          <Icon name="checks2" title="View icon" />
        </span>
      )} */}

      <div className="message-info__container">
        {true && <i className="message-info__item">edited</i>}

        <span className="message-info__item message-info__date">
          {sendingDate}
        </span>
        {message.isOutgoing && (
          <span className="message-info__item message-info__views">
            {renderMessageStatus()}
          </span>
        )}
      </div>
    </span>
  )
}
