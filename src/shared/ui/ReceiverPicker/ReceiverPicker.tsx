import {FC, useCallback, useState} from 'react'
import {useAppSelector} from '../../../app/store'
import {chatsSelectors} from '../../../features/chats/state'
import {Modal} from '../Modal/Modal'
import {ListItem} from '../ListItem/ListItem'
import {InputText} from '../Input/Input'
import './ReceiverPicker.scss'
interface ReceiverPickerProps {
  isOpen: boolean
  placeholder: string
  onSelect: (receiverId: string) => void
  onClose: VoidFunction
}

// This is a Chat-Or-User picker
export const ReceiverPicker: FC<ReceiverPickerProps> = ({
  isOpen,
  placeholder,
  onSelect,
  onClose,
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
    const filteredList = chats.filter((chat) => chat.title.includes(searchText))
    if (filteredList.length) {
      return filteredList.map((chat) => (
        <ListItem
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
  }, [searchText, onSelect, chats, onClose])
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
