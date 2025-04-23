import {FC, useMemo} from 'react'
import {Modal} from '../../../../shared/ui/Modal/Modal'
import {Chat} from '../../../chats/types'
import {Button} from '../../../../shared/ui'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'
import {Message} from '../../types'
import {useAppDispatch, useAppSelector} from '../../../../app/store'
import {messagesSelectors} from '../../state/messages-selectors'
import {uniqueArray} from '../../../../shared/helpers/uniqueArray'
import {messagesThunks} from '../../api'
import {useBoolean} from '../../../../shared/hooks/useBoolean'
import {Checkbox} from '../../../../shared/ui/Checkbox/Checkbox'

import './DeleteMessagesModal.scss'
import {messagesActions} from '../../state/messages-slice'

interface DeleteMessagesModalProps {
  chat: Chat
  message?: Message
  isOpen: boolean
  onClose: VoidFunction
}
export const DeleteMessagesModal: FC<DeleteMessagesModalProps> = ({
  chat,
  message,
  isOpen,
  onClose,
}) => {
  const {value, toggle} = useBoolean(false)
  const dispatch = useAppDispatch()
  const selectedMessages = useAppSelector(messagesSelectors.selectSelectedIds)

  const isPrivateChat = Boolean(chat.userId)

  const idsToDelete = useMemo(
    () =>
      uniqueArray(
        [...selectedMessages, message?.id].filter(Boolean) as string[]
      ),
    [selectedMessages, message]
  )
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="delete-messages-modal"
      header={
        <>
          <Avatar size="extra-small" color={chat.color} title={chat.title} />
          <p className="text-bold">Delete {idsToDelete.length} messages</p>
        </>
      }
      content={
        <>
          Are you sure you want to delete these message?
          {isPrivateChat && (
            <Checkbox
              checked={value}
              onToggle={toggle}
              label={`Also delete for ${chat.title}`}
            />
          )}
        </>
      }
      actions={
        <>
          <Button
            uppercase
            size="small"
            color="primary"
            variant="transparent"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            uppercase
            size="small"
            color="red"
            variant="transparent"
            onClick={() => {
              onClose()
              dispatch(
                messagesActions.toggleChatMessageSelection({active: false})
              )
              dispatch(
                messagesThunks.deleteMessages({
                  ids: idsToDelete,
                  chatId: chat.id,
                  deleteForAll: chat.userId ? value : true,
                })
              )
            }}
          >
            Delete
          </Button>
        </>
      }
    />
  )
}
