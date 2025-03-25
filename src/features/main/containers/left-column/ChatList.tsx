import {type FC} from 'react'
import {useNavigate} from 'react-router-dom'

import {store, useAppSelector} from '../../../../app/store'

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
import {usersSelectors} from '../../../users/state/users-selectors'
import {User} from '../../../auth/types'
import {ChatItem} from '../../../chats/components/ChatItem'

export const ChatList: FC = () => {
  const {push} = useNavigationStack()

  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
  const chats = useAppSelector(chatsSelectors.selectAll)
  const navigate = useNavigate()

  return (
    <div className="chat-list">
      {chats.map((chat) => {
        if (!chat.lastMessage) {
          console.log('NO MESSAGE', chat.title)
        }
        // console.log(chat.lastMessage)
        return <ChatItem key={chat.id} chat={chat} />
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
