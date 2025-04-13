import {FC, useCallback, useState} from 'react'
import {useAppSelector} from '../../../app/store'
import {chatsSelectors} from '../../../features/chats/state'
import {Modal} from '../Modal/Modal'
import {ListItem} from '../ListItem/ListItem'
import {InputText} from '../Input/Input'
import './ReceiverPicker.scss'
import {User} from '../../../features/auth/types'
import {getUserTitle} from '../../../features/users/helpers'
interface ReceiverPickerProps {
  isOpen: boolean
  placeholder: string
  onSelect: (receiverId: string) => void
  onClose: VoidFunction
  users?: User[]
}

// This is a Chat-Or-User picker
export const ReceiverPicker: FC<ReceiverPickerProps> = ({
  isOpen,
  placeholder,
  onSelect,
  onClose,
  users,
}) => {
  const chats = useAppSelector((state) => chatsSelectors.selectAll(state))
  // const contacts = useAppSelector((state) =>
  //   usersSelectors.selectContacts(state)
  // )
  const [searchText, setSearchText] = useState('')
  /**
   * @TODO  треба сортувати, чати, а потім контакти, з якими немає чатів
   */

  const renderList = useCallback(() => {
    if (users) {
      const filteredList = users.filter((user) =>
        getUserTitle(user).includes(searchText)
      )
      if (filteredList.length) {
        return filteredList.map((user) => (
          <ListItem
            fullwidth={false}
            title={getUserTitle(user)}
            subtitle={'status'}
            avatarSize="small"
            itemColor={user.color}
            key={user.id}
            onClick={() => {
              onSelect(user.id)
              onClose()
            }}
          />
        ))
      }
    }

    const filteredList = chats.filter((chat) => chat.title.includes(searchText))
    if (filteredList.length) {
      return filteredList.map((chat) => (
        <ListItem
          fullwidth={false}
          title={chat.title}
          subtitle={`${chat.membersCount} members`}
          key={chat.id}
          itemColor={chat.color}
          avatarSize="small"
          onClick={() => {
            onSelect(chat.id)

            onClose()
          }}
        />
      ))
    }

    return <p className="no-results">No results.</p>
  }, [searchText, onSelect, chats, onClose, users])
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="receiver-picker-modal"
      header={
        <InputText
          onChange={(e) => {
            setSearchText(e.currentTarget.value)
          }}
          value={searchText}
          variant="default"
          placeholder={placeholder}
        />
      }
      content={renderList()}
      // actions={}
    />
  )
}
