import {FC, useState} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {Chat} from '../../../chats/types'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'
import {InputText} from '../../../../shared/ui/Input/Input'
import {Section} from '../../../../shared/ui/Section/Section'
import {FloatButton} from '../../../../shared/ui/FloatButton/FloatButton'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {Icon} from '../../../../shared/ui/Icon/Icon'
import {useBoolean} from '../../../../shared/hooks/useBoolean'
import {ChatAdministrators} from './ChatAdministrators'
import {ChatPrivacyType} from './ChatPrivacyType'
import {useAppDispatch} from '../../../../app/store'
import {chatsThunks} from '../../../chats/api'

interface ChatEditProps {
  chat: Chat
}
export const ChatEdit: FC<ChatEditProps> = ({chat}) => {
  const {pop, push} = useNavigationStack()
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState(chat.title)
  const [description, setDescription] = useState(chat.description ?? '')
  const {value: isLoading, toggle: toggleIsLoading} = useBoolean()
  const {value: chatHistory, toggle: toggleChatHistory} = useBoolean()
  const {value: isEdited, setValue: setIsEdited} = useBoolean()
  const canEdit = chat.isOwner || chat.adminPermissions?.changeInfo
  const canBan = chat.isOwner || chat.adminPermissions?.banUsers
  // const isEdited =
  //   title !== chat.title || description !== (chat.description ?? '')
  return (
    <Column className="chat-management" title="Edit" onGoBack={pop}>
      <Section>
        <Avatar color={chat.color} title={chat.title} size="large" />

        <div className="chat-management__inputs">
          <InputText
            value={title}
            onChange={(e) => {
              setIsEdited(true)
              setTitle(e.currentTarget.value)
            }}
            label="Title (required)"
            isDisabled={!canEdit}
          />
          <InputText
            value={description}
            onChange={(e) => {
              setIsEdited(true)
              setDescription(e.currentTarget.value)
            }}
            label="Description (optional)"
            withIndicator
            maxLength={200}
            isDisabled={!canEdit}
          />
        </div>
      </Section>
      <h3 className="section__subheading">
        You
        {canEdit ? ' can ' : ' can`t '}
        provide an optional information for your group.
      </h3>

      <Section>
        {chat.isOwner && (
          <ListItem
            startContent={<Icon name="lock" title="Group type" />}
            withAvatar={false}
            title="Group Type"
            subtitle={chat.privacyType === 'PRIVATE' ? 'Private' : 'Public'}
            onClick={() => {
              push(<ChatPrivacyType chat={chat} />)
            }}
          />
        )}
        {canEdit && (
          <>
            <ListItem
              disabled
              startContent={<Icon title="Invite Links" name={'link'} />}
              withAvatar={false}
              title="Invite Links"
              subtitle="Coming soon"
              onClick={() => {}}
            />
            <ListItem
              disabled
              startContent={<Icon title="Join Requests" name={'addUser'} />}
              withAvatar={false}
              title="Join Requests"
              subtitle="Coming soon"
              onClick={() => {}}
            />
            <ListItem
              disabled
              startContent={<Icon title="Permissions" name={'permissions'} />}
              subtitle="Coming soon"
              withAvatar={false}
              title="Permissions"
              onClick={() => {}}
            />
          </>
        )}
      </Section>
      <Section>
        {canEdit && (
          <ListItem
            startContent={<Icon title="Administrators" name={'admin'} />}
            subtitle={chat.membersCount}
            withAvatar={false}
            title="Administrators"
            onClick={() => {
              push(<ChatAdministrators chat={chat} />)
            }}
          />
        )}
        <ListItem
          startContent={<Icon title="Members" name={'users'} />}
          subtitle={chat.membersCount}
          withAvatar={false}
          title="Members"
          onClick={() => {}}
        />
        {canBan && (
          <ListItem
            startContent={<Icon title="Removed users" name={'deleteUser'} />}
            subtitle={'No removed users'}
            withAvatar={false}
            title="Removed users"
            onClick={() => {}}
          />
        )}
      </Section>

      {canEdit && (
        <Section>
          <ListItem
            withAvatar={false}
            title="Chat history for new members"
            onClick={toggleChatHistory}
            checked={chatHistory}
          />

          {/* <ListItem startContent={<Checkbox />} /> */}
        </Section>
      )}
      {chat.isOwner && (
        <Section>
          <ListItem
            startContent={<Icon title="Delete" name="deleteIcon" />}
            // subtitle={'No removed users'}
            withAvatar={false}
            title="Delete Group"
            onClick={() => {}}
            danger
          />
        </Section>
      )}
      <FloatButton
        isVisible={isEdited}
        iconName="check"
        title="Edit"
        isLoading={isLoading}
        onClick={async () => {
          toggleIsLoading()
          await dispatch(
            chatsThunks.updateChatInfo({
              chatId: chat.id,
              title: title.trim(),
              description: description.trim(),
            })
          ).unwrap()
          toggleIsLoading()
          setIsEdited(false)
        }}
      />
    </Column>
  )
}
