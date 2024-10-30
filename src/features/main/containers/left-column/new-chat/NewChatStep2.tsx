import {type FC, useState} from 'react'
import {useNavigationStack} from '../../../../../shared/ui/NavigationStack/useNavigationStack'
import {Column} from '../../../../../shared/ui/Column/Column'
import {IconButton} from '../../../../../shared/ui/IconButton/IconButton'
import {useAppDispatch} from '../../../../../app/store'
import {emitEventWithHandling, WsException} from '../../../../../app/socket'
import {chatsActions} from '../../../../chats/chats-slice'
import {Chat, CreateChatParams} from '../../../../chats/types'
import {useBoolean} from '../../../../../shared/hooks/useBoolean'
import {Modal} from '../../../../../shared/ui/Modal/Modal'
import {Button} from '../../../../../shared/ui'
import {ApiError} from '../../../../../app/types'

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
  const [error, setError] = useState<string | null>(null)
  const chatType = isGroup ? 'Group' : 'Channel'

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const result = await emitEventWithHandling<CreateChatParams, Chat>(
        'createChat',
        {
          title,
          description,
          users: selectedIds,
          type: isGroup ? 'GROUP' : 'CHANNEL',
        }
      )
      dispatch(chatsActions.addOne(result))

      console.log({result})
      pop({toRoot: true})
    } catch (error) {
      const castedError = error as ApiError
      if (castedError?.code === 'VALIDATION_ERROR') {
        setError(castedError.code)
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
        onClose={() => setError(null)}
        content={error}
        header={'Something went wrong'}
        actions={<Button onClick={() => setError(null)}>Ok</Button>}
      />
    </Column>
  )
}
