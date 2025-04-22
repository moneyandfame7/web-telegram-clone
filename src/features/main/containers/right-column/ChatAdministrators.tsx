import {FC, useState} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {Chat} from '../../../chats/types'
import {FloatButton} from '../../../../shared/ui/FloatButton/FloatButton'
import {ReceiverPicker} from '../../../../shared/ui/ReceiverPicker/ReceiverPicker'
import {useBoolean} from '../../../../shared/hooks/useBoolean'
import {store, useAppSelector} from '../../../../app/store'
import {chatsSelectors} from '../../../chats/state'
import {usersSelectors} from '../../../users/state/users-selectors'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {getUserTitle} from '../../../users/helpers'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {ChatAdministratorPermissions} from './ChatAdministratorPermissions'
import {User} from '../../../auth/types'
import {InputText} from '../../../../shared/ui/Input/Input'
import {Section} from '../../../../shared/ui/Section/Section'

interface ChatAdministratorsProps {
  chat: Chat
}
export const ChatAdministrators: FC<ChatAdministratorsProps> = ({chat}) => {
  const {push, pop} = useNavigationStack()
  const {value: isMemberPickerOpen, toggle: toggleMemberPicker} = useBoolean()

  const members = useAppSelector((state) =>
    chatsSelectors.selectMembers(state, chat.id, true)
  )

  const admins = useAppSelector((state) =>
    chatsSelectors.selectAdmins(state, chat.id)
  )

  const [count, setCount] = useState(0)

  const renderAdminList = () => {
    return admins.map((user) => {
      const state = store.getState()
      const member = chatsSelectors.selectMemberById(state, chat.id, user.id)

      const promoter = member?.adminPermissions
        ? usersSelectors.selectById(
            state,
            member?.adminPermissions?.promotedByUserId
          )
        : undefined
      return (
        <ListItem
          key={user.id}
          itemColor={user.color}
          title={getUserTitle(user)}
          subtitle={
            chat.isOwner && user.isSelf
              ? 'Owner'
              : `Promoted by ${promoter ? getUserTitle(promoter) : user.id}`
          }
          avatarSize="small"
          fullwidth={false}
          onClick={() => {
            push(<ChatAdministratorPermissions member={member!} user={user} />)
          }}
        />
      )
    })
  }
  return (
    <Column className="chat-management" title="Administrators" onGoBack={pop}>
      <Section>
        <InputText
          variant="default"
          value=""
          placeholder="Search..."
          onChange={() => {}}
        />
      </Section>
      <h5
        onClick={() => {
          setCount((prev) => prev + 1)
        }}
      >
        CHAT ADMINS LIST??? {count}
      </h5>
      {renderAdminList()}
      <FloatButton
        isVisible
        iconName="addUser"
        title="Add Admin"
        onClick={toggleMemberPicker}
      />

      <ReceiverPicker
        isOpen={isMemberPickerOpen}
        placeholder="Search..."
        onClose={toggleMemberPicker}
        users={members}
        onSelect={(memberId) => {
          console.log({memberId})
          const state = store.getState()
          const user = usersSelectors.selectById(state, memberId) as
            | User
            | undefined
          const member = chatsSelectors.selectMemberById(
            state,
            chat.id,
            memberId
          )
          if (!member || !user) {
            return
          }
          push(<ChatAdministratorPermissions user={user} member={member} />)
        }}
      />
    </Column>
  )
}
