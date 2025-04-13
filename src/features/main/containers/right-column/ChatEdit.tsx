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

interface ChatEditProps {
  chat: Chat
}
export const ChatEdit: FC<ChatEditProps> = ({chat}) => {
  const {pop, push} = useNavigationStack()

  const [title, setTitle] = useState(chat.title)
  const [description, setDescription] = useState(chat.description ?? '')

  const {value: chatHistory, toggle: toggleChatHistory} = useBoolean()

  return (
    <Column className="chat-management" title="Edit" onGoBack={pop}>
      <Section>
        <Avatar color={chat.color} title={chat.title} size="large" />

        <h5 className="chat-management__title">{chat.title}</h5>
        <span className="chat-management__subtitle">
          {chat.membersCount} members
        </span>

        <div className="chat-management__inputs">
          <InputText
            value={title}
            onChange={(e) => {
              setTitle(e.currentTarget.value)
            }}
            label="Title (required)"
          />
          <InputText
            value={description}
            onChange={(e) => {
              setDescription(e.currentTarget.value)
            }}
            label="Description (optional)"
            withIndicator
            maxLength={200}
          />
        </div>
      </Section>

      <p className="chat-management__caption">
        You can provide an optional information for your group.
      </p>

      <Section>
        <ListItem
          disabled
          startContent={<Icon name="lock" title="Group type" />}
          withAvatar={false}
          fullwidth={false}
          title="Group Type"
          subtitle="Coming soon"
          onClick={() => {}}
        />
        <ListItem
          disabled
          startContent={<Icon title="Invite Links" name={'link'} />}
          withAvatar={false}
          fullwidth={false}
          title="Invite Links"
          subtitle="Coming soon"
          onClick={() => {}}
        />
        <ListItem
          disabled
          startContent={<Icon title="Join Requests" name={'addUser'} />}
          withAvatar={false}
          fullwidth={false}
          title="Join Requests"
          subtitle="Coming soon"
          onClick={() => {}}
        />
        <ListItem
          disabled
          startContent={<Icon title="Permissions" name={'permissions'} />}
          subtitle="Coming soon"
          withAvatar={false}
          fullwidth={false}
          title="Permissions"
          onClick={() => {}}
        />
      </Section>

      <Section>
        <ListItem
          startContent={<Icon title="Administrators" name={'admin'} />}
          subtitle={chat.membersCount}
          withAvatar={false}
          fullwidth={false}
          title="Administrators"
          onClick={() => {
            push(<ChatAdministrators chat={chat} />)
          }}
        />
        <ListItem
          startContent={<Icon title="Members" name={'users'} />}
          subtitle={chat.membersCount}
          withAvatar={false}
          fullwidth={false}
          title="Members"
          onClick={() => {}}
        />

        <ListItem
          startContent={<Icon title="Removed users" name={'deleteUser'} />}
          subtitle={'No removed users'}
          withAvatar={false}
          fullwidth={false}
          title="Removed users"
          onClick={() => {}}
        />
      </Section>

      <Section>
        <ListItem
          withAvatar={false}
          fullwidth={false}
          title="Chat history for new members"
          onClick={toggleChatHistory}
          checked={chatHistory}
        />
        {/* <ListItem startContent={<Checkbox />} /> */}
      </Section>

      <Section>
        <ListItem
          startContent={<Icon title="Delete" name="deleteIcon" />}
          // subtitle={'No removed users'}
          withAvatar={false}
          fullwidth={false}
          title="Delete Group"
          onClick={() => {}}
          danger
        />
      </Section>

      <FloatButton
        isVisible={
          title !== chat.title || description !== (chat.description ?? '')
        }
        iconName="check"
        title="Edit"
        onClick={() => {}}
      />
    </Column>
  )
}
