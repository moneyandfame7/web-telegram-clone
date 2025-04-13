import {type FC, useState} from 'react'
import {useNavigationStack} from '../../../../../shared/ui/NavigationStack/useNavigationStack'
import {Column} from '../../../../../shared/ui/Column/Column'
import {IconButton} from '../../../../../shared/ui/IconButton/IconButton'
import {useAppDispatch} from '../../../../../app/store'
import {Modal} from '../../../../../shared/ui/Modal/Modal'
import {Button} from '../../../../../shared/ui'
import {chatsThunks} from '../../../../chats/api'
import {isApiError} from '../../../../../shared/helpers/isApiError'

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
  const [error, setError] = useState<string | undefined>(undefined)
  const chatType = isGroup ? 'Group' : 'Channel'

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      await dispatch(
        chatsThunks.createChat({
          description,
          users: selectedIds,
          title,
          type: isGroup ? 'GROUP' : 'CHANNEL',
        })
      ).unwrap()
      pop({toRoot: true})
    } catch (error) {
      if (isApiError(error)) {
        setError(error.message)
      } else {
        setError('Unknown error')
      }
    } finally {
      setIsLoading(false)
    }
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
      {chatType === 'Channel' && (
        <input
          placeholder={`Description`}
          value={description}
          onChange={(e) => {
            setDescription(e.currentTarget.value)
          }}
        />
      )}
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
      <Modal
        isOpen={!!error}
        onClose={() => setError(undefined)}
        content={error}
        header={'Something went wrong'}
        actions={<Button onClick={() => setError(undefined)}>Ok</Button>}
      />
    </Column>
  )
}
