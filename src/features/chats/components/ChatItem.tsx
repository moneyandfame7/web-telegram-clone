import {FC} from 'react'
import {Chat} from '../types'
import {ListItem} from '../../../shared/ui/ListItem/ListItem'
import {formatMessageTime} from '../../messages/helpers'
import {Icon} from '../../../shared/ui/Icon/Icon'
import {Badge} from '../../../shared/ui/Badge/Badge'
import {useNavigate} from 'react-router-dom'
import {useAppSelector} from '../../../app/store'
import {usersSelectors} from '../../users/state/users-selectors'
import {User} from '../../auth/types'
import {getUserTitle} from '../../users/helpers'

interface ChatItemProps {
  chat: Chat
}
export const ChatItem: FC<ChatItemProps> = ({chat}) => {
  const navigate = useNavigate()
  const isPrivateChat = Boolean(chat.userId)
  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
  const lastMessageSender = useAppSelector((state) =>
    usersSelectors.selectById(state, chat.lastMessage?.senderId ?? '')
  ) as User | undefined

  const renderTitleRight = () => {
    if (!chat?.lastMessage) {
      return (
        <span>
          {formatMessageTime({
            date: new Date(chat.createdAt),
            onlyTime: false,
          })}
        </span>
      )
    }

    const isRead =
      (chat.theirLastReadMessageSequenceId ?? -1) >= chat.lastMessage.sequenceId
    return (
      <>
        {chat.lastMessage.isOutgoing && (
          <Icon
            title="Read message icon"
            name={isRead ? 'checks2' : 'check'}
            size="small"
          />
        )}
        <span>
          {formatMessageTime({
            date: new Date(chat.lastMessage.createdAt),
            onlyTime: false,
          })}
        </span>
      </>
    )
  }
  const renderSubtitle = () => {
    // console.log('NO LAST MESSAGE XDD', chat, chat.lastMessage)

    if (!chat.lastMessage) {
      return '??No message??'
    }

    const message = chat.lastMessage
    const text = <>{message.text || message.forwardInfo?.text}</>
    if (message.isOutgoing) {
      return (
        <>
          {!isPrivateChat && <span className="text-primary">You: </span>}
          {message.forwardInfo && (
            <Icon
              name="forwardFilled"
              title="Forwarded"
              size="small"
              color="secondary"
            />
          )}
          <p>{text}</p>
        </>
      )
    } else if (lastMessageSender) {
      console.log('lastMessageSender')

      return (
        <>
          <span className="text-primary">
            {getUserTitle(lastMessageSender)}:{' '}
          </span>
          {message.forwardInfo && (
            <Icon
              name="forwardFilled"
              title="Forwarded"
              size="small"
              color="secondary"
            />
          )}
          <p>{text}</p>
        </>
      )
    }
  }

  return (
    <ListItem
      title={chat.title}
      titleRight={renderTitleRight()}
      subtitle={renderSubtitle()}
      subtitleRight={
        chat.unreadCount > 0 ? <Badge number={chat.unreadCount} /> : undefined
      }
      itemColor={chat.color}
      selected={currentChatId === chat.id}
      onClick={() => {
        navigate(chat.id)
      }}
      contextActions={[
        {
          title: 'Open in new tab',
          handler: () => {},
          icon: 'newTab',
        },
      ]}
    />
  )
}
