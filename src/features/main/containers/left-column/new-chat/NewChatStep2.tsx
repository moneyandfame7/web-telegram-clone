import {type FC, useState} from 'react'
import {useNavigationStack} from '../../../../../shared/ui/NavigationStack/useNavigationStack'
import {Column} from '../../../../../shared/ui/Column/Column'
import {IconButton} from '../../../../../shared/ui/IconButton/IconButton'
import {useAppDispatch} from '../../../../../app/store'
import {chatsThunks} from '../../../../chats/api'

interface NewChatStep2Props {
  isGroup: boolean
  selectedIds: string[]
}
export const NewChatStep2: FC<NewChatStep2Props> = ({isGroup, selectedIds}) => {
  const dispatch = useAppDispatch()
  const {pop} = useNavigationStack()

  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const chatType = isGroup ? 'Group' : 'Channel'

  const handleSubmit = async () => {
    setIsLoading(true)
    await dispatch(
      chatsThunks.createChat({
        title,
        description,
        users: selectedIds,
        type: isGroup ? 'GROUP' : 'CHANNEL',
      })
    ).unwrap()
    setIsLoading(false)
    pop({toRoot: true})
  }
  return (
    <Column title={`New ${chatType}`} onGoBack={pop}>
      <input
        placeholder={`${chatType} Name`}
        value={title}
        onChange={(e) => {
          setTitle(e.currentTarget.value)
        }}
      />
      {title.length > 0 && (
        <IconButton
          onClick={handleSubmit}
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
          isLoading={isLoading}
        />
      )}
    </Column>
  )
}
