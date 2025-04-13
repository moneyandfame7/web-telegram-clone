import {FC, useState} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {AdminPermissions, ChatMember} from '../../../chats/types'
import {User} from '../../../auth/types'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {getUserTitle} from '../../../users/helpers'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {store, useAppDispatch, useAppSelector} from '../../../../app/store'
import {chatsThunks} from '../../../chats/api'

interface ChatAdministratorPermissionsProps {
  user: User
  member: ChatMember
}
export const ChatAdministratorPermissions: FC<
  ChatAdministratorPermissionsProps
> = ({user, member}) => {
  const {pop} = useNavigationStack()

  const dispatch = useAppDispatch()

  const [adminPermissions, setAdminPermissions] = useState<
    Omit<AdminPermissions, 'promotedByUserId'>
  >({
    addNewAdmins: true,
    banUsers: true,
    changeInfo: true,
    deleteMessages: true,
    pinMessages: true,
  })
  return (
    <Column
      title="Admin Rights"
      onGoBack={async () => {
        const currentUserId = store.getState().auth.session?.userId
        if (!currentUserId) {
          return
        }
        dispatch(
          chatsThunks.updateAdmin({
            chatId: member.chatId,
            userId: member.userId,
            adminPermissions: {
              ...adminPermissions,
              promotedByUserId: currentUserId,
            },
          })
        )
        pop()
      }}
    >
      <h1>EDIT CURRENT USER </h1>

      <h2>What can this admin do?</h2>
      <ListItem
        title={getUserTitle(user)}
        subtitle="status"
        itemColor={user.color}
        onClick={() => {}}
        fullwidth={false}
        avatarSize="small"
      />
    </Column>
  )
}
