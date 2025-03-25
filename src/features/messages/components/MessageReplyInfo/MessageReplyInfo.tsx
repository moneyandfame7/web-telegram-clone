import {FC} from 'react'
import {MessageReplyInfo as MessageReplyInfoType} from '../../types'
import {useAppSelector} from '../../../../app/store'
import {usersSelectors} from '../../../users/state/users-selectors'
import {getUserTitle} from '../../../users/helpers'
import {User} from '../../../auth/types'

import './MessageReplyInfo.scss'
interface MessageReplyInfoProps {
  replyInfo: MessageReplyInfoType
}
export const MessageReplyInfo: FC<MessageReplyInfoProps> = ({replyInfo}) => {
  const sender = useAppSelector((state) =>
    usersSelectors.selectById(state, replyInfo.senderId)
  ) as User | undefined
  return (
    <div className="message-reply-info">
      {sender && <p>{getUserTitle(sender)}</p>}
      <p>{replyInfo.text}</p>
    </div>
  )
}
