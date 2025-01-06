import {type FC} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAppSelector} from '../../../../app/store'

import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {DropdownMenu} from '../../../../shared/ui/DropdownMenu/DropdownMenu'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'

import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'

import {chatsSelectors} from '../../../chats/state'

import {NewChatStep1} from './new-chat/NewChatStep1'
import {Contacts} from './Contacts'

import {Chat} from '../../../chats/types'
import {Icon} from '../../../../shared/ui/Icon/Icon'

import {formatMessageTime} from '../../../messages/helpers'

import './ChatList.scss'
import {Badge} from '../../../../shared/ui/Badge/Badge'

export const ChatList: FC = () => {
  const {push} = useNavigationStack()

  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
  const chats = useAppSelector(chatsSelectors.selectAll)
  const navigate = useNavigate()

  const renderTitleRight = (chat: Chat) => {
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
      chat.theirLastReadMessageSequenceId ?? -1 >= chat.lastMessage.sequenceId
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

  return (
    <div className="chat-list">
      {chats.map((chat) => {
        return (
          <ListItem
            key={chat.id}
            title={chat.title}
            titleRight={renderTitleRight(chat)}
            subtitle={chat.lastMessage?.text}
            subtitleRight={
              chat.unreadCount > 0 ? (
                <Badge number={chat.unreadCount} />
              ) : undefined
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
      })}

      <div className="create-chat-button">
        <DropdownMenu
          button={
            <IconButton
              size="large"
              name="editFilled"
              title="Create new chat"
              color="white"
              variant="primary"
            />
          }
          position="top-right"
          transform="bottom right"
        >
          <MenuItem
            icon="channel"
            title="New Channel"
            onClick={() => {
              push(<NewChatStep1 isGroup={false} />)
            }}
          />
          <MenuItem
            icon="users"
            title="New Group"
            onClick={() => {
              push(<NewChatStep1 isGroup />)
            }}
          />
          <MenuItem
            icon="user"
            title="New Private Chat"
            onClick={() => {
              push(<Contacts />)
            }}
          />
        </DropdownMenu>
      </div>
    </div>
  )
}
