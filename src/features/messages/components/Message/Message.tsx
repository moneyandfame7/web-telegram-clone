import {FC} from 'react'

import {Message as MessageType} from '../../types'
import clsx from 'clsx'
import {useAppSelector} from '../../../../app/store'
import {User} from '../../../auth/types'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'
import {getUserTitle} from '../../../users/helpers'

import './Message.scss'
import {MessageInfo} from '../MessageInfo/MessageInfo'
import {chatsSelectors} from '../../../chats/state'
import {Chat} from '../../../chats/types'
import {usersSelectors} from '../../../users/state/users-selectors'

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
  const chat = useAppSelector((state) =>
    chatsSelectors.selectById(state, message.chatId)
  ) as Chat | undefined
  const sender = useAppSelector((state) =>
    usersSelectors.selectById(state, message.senderId)
  ) as User | undefined

  const buildedClass = clsx('message', {
    outgoing: message.isOutgoing,
    incoming: !message.isOutgoing,
    highlighted: message.isHighlighted,
    'last-in-group': isLastInGroup,
    'first-in-group': isFirstInGroup,
  })

  return (
    <div className={buildedClass}>
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
          LAST READED: {chat?.theirLastReadMessageSequenceId}
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
    </div>
  )
}
