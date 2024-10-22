import {useState, type FC} from 'react'
import {useAppDispatch, useAppSelector} from '../../../../app/store'
import {chatsActions, chatsSelectors} from '../../../chats/chats-slice'
import {ChatItem} from '../../../chats/components/ChatItem/ChatItem'
import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {DropdownMenu} from '../../../../shared/ui/DropdownMenu/DropdownMenu'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'

import {NewChatStep1} from './new-chat/NewChatStep1'

import {Button} from '../../../../shared/ui'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'

import './ChatList.scss'
import {Contacts} from './Contacts'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'

export const ChatList: FC = () => {
  const dispatch = useAppDispatch()
  const currentChat = useAppSelector((state) => state.chats.currentChatId)
  const {push} = useNavigationStack()

  const chats = useAppSelector(chatsSelectors.selectAll)

  return (
    <div className="chat-list">
      <h1>ChatList</h1>

      <h1>Current chat?: {currentChat}</h1>
      {chats.map((chat) => (
        <ListItem
          title={chat.title}
          titleRight="Right"
          subtitle="Subtitle..."
          subtitleRight="Right"
          key={chat.id}
          itemColor={chat.color}
          onClick={() => {
            dispatch(chatsActions.setCurrentChat(chat.id))
          }}
        />
      ))}

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
