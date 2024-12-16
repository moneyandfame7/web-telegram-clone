import {useState, type FC} from 'react'
import {useAppSelector} from '../../../../app/store'

import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {DropdownMenu} from '../../../../shared/ui/DropdownMenu/DropdownMenu'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {Button} from '../../../../shared/ui'

import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'

import {chatsSelectors} from '../../../chats/state'

import {NewChatStep1} from './new-chat/NewChatStep1'
import {Contacts} from './Contacts'

import './ChatList.scss'
import {useNavigate} from 'react-router-dom'

export const ChatList: FC = () => {
  const {push} = useNavigationStack()

  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
  const chats = useAppSelector(chatsSelectors.selectAll)
  const navigate = useNavigate()
  return (
    <div className="chat-list">
      {chats.map((chat) => {
        return (
          <ListItem
            key={chat.id}
            title={chat.title}
            titleRight="Right"
            subtitle={chat.lastMessage?.text}
            subtitleRight={`${chat.unreadCount > 0 ? chat.unreadCount : ''}`}
            itemColor={chat.color}
            selected={currentChatId === chat.id}
            onClick={() => {
              navigate(chat.id)
            }}
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
            icon="animals"
            title="Circular component"
            onClick={() => {
              push(<CircularComponent screenNumber={1} />)
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

interface CircularComponentProps {
  screenNumber: number
}
const CircularComponent: FC<CircularComponentProps> = ({screenNumber}) => {
  const {push, pop} = useNavigationStack()
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>CircularComponent N. {screenNumber}</h1>
      <Button onClick={() => setCount((prev) => prev + 1)}>
        Counter {count}
      </Button>
      <Button
        onClick={() => {
          pop()
        }}
      >
        Go to Component {screenNumber - 1}
      </Button>
      <Button
        onClick={() => {
          push(<CircularComponent screenNumber={screenNumber + 1} />)
        }}
      >
        Go to Component {screenNumber + 1}
      </Button>
    </div>
  )
}
