import {FC} from 'react'

import {Message as MessageType} from '../../types'
import clsx from 'clsx'
import {useAppSelector} from '../../../../app/store'
import {usersSelectors} from '../../../users/users-slice'
import {User} from '../../../auth/types'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'
import {getUserTitle} from '../../../users/helpers'

import './Message.scss'
import {MessageInfo} from '../MessageInfo/MessageInfo'

interface MessageProps {
  message: MessageType
}
export const Message: FC<MessageProps> = ({message}) => {
  const sender = useAppSelector((state) =>
    usersSelectors.selectById(state, message.senderId)
  ) as User | undefined

  const buildedClass = clsx('message', {
    outgoing: message.isOutgoing,
    incoming: !message.isOutgoing,
  })
  return (
    <div className={buildedClass}>
      {!message.isOutgoing && (
        <Avatar
          color={sender?.color}
          title={sender ? getUserTitle(sender) : undefined}
          size="extra-small"
        />
      )}

      <div className="message-content">
        <div className="message-content__sender"></div>
        <div className="message-content__text">
          {message.text}
          <MessageInfo message={message} />
        </div>
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
      </div>
    </div>
  )
}
