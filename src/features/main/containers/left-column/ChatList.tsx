import {type FC} from 'react'

import {useAppSelector} from '../../../../app/store'

import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {DropdownMenu} from '../../../../shared/ui/DropdownMenu/DropdownMenu'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'

import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'

import {chatsSelectors} from '../../../chats/state'

import {NewChatStep1} from './new-chat/NewChatStep1'
import {Contacts} from './Contacts'

import './ChatList.scss'
import {ChatItem} from '../../../chats/components/ChatItem'

export const ChatList: FC = () => {
  const {push} = useNavigationStack()

  const chats = useAppSelector(chatsSelectors.selectAll)

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
