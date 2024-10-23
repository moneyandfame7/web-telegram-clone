import {useCallback, useState, type FC} from 'react'
import {Button} from '../../../../../shared/ui'
import {NewChatStep2} from './NewChatStep2'
import {useNavigationStack} from '../../../../../shared/ui/NavigationStack/useNavigationStack'
import {Column} from '../../../../../shared/ui/Column/Column'
import {IconButton} from '../../../../../shared/ui/IconButton/IconButton'
import {useAppSelector} from '../../../../../app/store'
import {usersSelectors} from '../../../../users/users-slice'
import {ListItem} from '../../../../../shared/ui/ListItem/ListItem'

interface NewChatStep1Props {
  isGroup: boolean
}
export const NewChatStep1: FC<NewChatStep1Props> = ({isGroup}) => {
  const contacts = useAppSelector(usersSelectors.selectContacts)
  const [searchUsername, setSearchUsername] = useState('')
  const {push, pop} = useNavigationStack()

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const onSelectMember = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((existingId) => existingId !== id)
      }
      return [...prev, id]
    })
  }, [])

  const isMemberSelected = (id: string) => {
    return selectedIds.includes(id)
  }

  const handleNextScreen = useCallback(() => {
    push(<NewChatStep2 isGroup={isGroup} selectedIds={selectedIds} />)
  }, [isGroup, selectedIds])

  const handleGoBack = useCallback(() => {
    pop({toRoot: true})
  }, [])

  return (
    <Column title={`Add Members`} onGoBack={handleGoBack}>
      <input
        placeholder="Add people..."
        value={searchUsername}
        onChange={(e) => {
          setSearchUsername(e.currentTarget.value)
        }}
      />

      {contacts.map((contact) => (
        <ListItem
          checked={isMemberSelected(contact.id)}
          itemColor={contact.color}
          key={contact.id}
          title={contact.firstName + ' ' + (contact.lastName ?? '')}
          subtitle="No message"
          onClick={() => {
            onSelectMember(contact.id)
          }}
        />
      ))}

      <IconButton
        onClick={handleNextScreen}
        size="large"
        variant="primary"
        title="Go Next"
        name="arrowRight"
        color="white"
        style={{
          position: 'absolute',
          bottom: 15,
          right: 15,
        }}
      />
    </Column>
  )
}
