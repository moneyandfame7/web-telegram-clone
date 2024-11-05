import {useState, type FC} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {useBoolean} from '../../../../shared/hooks/useBoolean'
import {Modal} from '../../../../shared/ui/Modal/Modal'
import {Button} from '../../../../shared/ui'
import {useAppDispatch, useAppSelector} from '../../../../app/store'
import {usersSelectors} from '../../../users/users-slice'
import {usersThunks} from '../../../users/api'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {chatsActions} from '../../../chats/chats-slice'
import {chatsThunks} from '../../../chats/api'

export const Contacts: FC = () => {
  const {pop} = useNavigationStack()
  const contacts = useAppSelector(usersSelectors.selectContacts)
  const dispatch = useAppDispatch()

  const {value, setFalse, setTrue} = useBoolean()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddContact = async () => {
    setIsLoading(true)

    await dispatch(usersThunks.addContact({firstName, lastName, username}))

    setIsLoading(false)
  }

  return (
    <Column onGoBack={pop} header={<input placeholder="Search" />}>
      <p>Contact 1</p>
      <p>Contact 1</p>
      <p>Contact 1</p>
      <p>Contact 1</p>
      <p>Contact 1</p>

      {contacts.map((contact) => (
        <ListItem
          title={contact.firstName + ' ' + (contact.lastName ?? '')}
          titleRight="Right"
          subtitle="Subtitle..."
          subtitleRight="Right"
          key={contact.id}
          itemColor={'BLUE'}
          onClick={() => {
            dispatch(chatsThunks.openChat({id: `u_${contact.id}`}))
          }}
        />
      ))}
      <IconButton
        name="plus"
        title="Add a new contact"
        variant="primary"
        color="white"
        size="large"
        style={{
          position: 'absolute',
          bottom: 15,
          right: 15,
        }}
        onClick={setTrue}
      />
      <Modal
        isOpen={value}
        onClose={setFalse}
        className="contacts-modal"
        title="Add Contact"
        content={
          <>
            <input
              placeholder="Firstname (required)"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.currentTarget.value)
              }}
            />
            <input
              placeholder="Lastname (optional)"
              value={lastName}
              onChange={(e) => {
                setLastName(e.currentTarget.value)
              }}
            />
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.currentTarget.value)
              }}
            />
          </>
        }
        actions={
          <Button
            onClick={handleAddContact}
            isLoading={isLoading}
            fullWidth
            size="small"
          >
            Add
          </Button>
        }
      />
    </Column>
  )
}
