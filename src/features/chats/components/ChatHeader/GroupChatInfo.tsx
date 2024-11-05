import {FC} from 'react'
import {useAppSelector} from '../../../../app/store'
import {Chat} from '../../types'
import {chatsSelectors} from '../../state/chats-selectors'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'

interface GroupChatInfoProps {
  chatId: string
}

export const GroupChatInfo: FC<GroupChatInfoProps> = ({chatId}) => {
  const chat = useAppSelector((state) =>
    chatsSelectors.selectById(state, chatId)
  ) as Chat | undefined

  return (
    <>
      <Avatar color={chat?.color} title={chat?.title} size="small" />
      <div className="chat-info__content">
        <p className="chat-info__title">{chat?.title}</p>
        <p className="chat-info__subtitle">{chat?.membersCount} members</p>
      </div>
    </>
  )
}
