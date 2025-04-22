import {FC, useState} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {AdminPermissions, ChatMember} from '../../../chats/types'
import {User} from '../../../auth/types'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {getUserTitle} from '../../../users/helpers'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {store, useAppDispatch, useAppSelector} from '../../../../app/store'
import {chatsThunks} from '../../../chats/api'
import {isAdminPermissionsChanged} from '../../../chats/helpers'
import {Section} from '../../../../shared/ui/Section/Section'
import {InputText} from '../../../../shared/ui/Input/Input'
import {Toggle} from '../../../../shared/ui/Toggle/Toggle'
import {Button} from '../../../../shared/ui'
import {Icon} from '../../../../shared/ui/Icon/Icon'

interface ChatAdministratorPermissionsProps {
  user: User
  member: ChatMember
}

const PERMISSIONS_LABELS: Record<
  keyof Omit<AdminPermissions, 'promotedByUserId' | 'customTitle'>,
  string
> = {
  changeInfo: 'Change Group Info',
  deleteMessages: 'Delete Messages',
  banUsers: 'Ban Users',
  pinMessages: 'Pin Messages',
  addNewAdmins: 'Add New Admins',
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
        if (
          isAdminPermissionsChanged(member, {
            ...adminPermissions,
            promotedByUserId: currentUserId,
          })
        ) {
          console.log('admin permissions edited')
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
      <Section>
        <ListItem
          title={getUserTitle(user)}
          subtitle="status"
          itemColor={user.color}
          onClick={() => {}}
          fullwidth={false}
          avatarSize="small"
        />
        <h2 className="section__heading">What can this admin do?</h2>
        {Object.entries(PERMISSIONS_LABELS).map(([key, label]) => (
          <ListItem
            key={key}
            title={label}
            onClick={() => {
              setAdminPermissions((prev) => ({
                ...prev,
                [key]: !prev[key as keyof typeof PERMISSIONS_LABELS],
              }))
            }}
            withAvatar={false}
            titleRight={
              <Toggle
                checked={
                  adminPermissions[key as keyof typeof PERMISSIONS_LABELS]
                }
              />
            }
          />
        ))}
        <h3 className="section__subheading">
          This admin will be able to add new admins with equal or fewer rights.
        </h3>
      </Section>
      <Section>
        <h2 className="section__heading">Custom title</h2>

        <InputText
          value={adminPermissions.customTitle ?? ''}
          onChange={(e) => {
            setAdminPermissions({
              ...adminPermissions,
              customTitle: e.currentTarget.value,
            })
          }}
        />
        <h3 className="section__subheading">
          A title that members will see instead of &apos;admin&apos;
        </h3>
      </Section>

      <Section>
        <ListItem
          withAvatar={false}
          fullwidth={false}
          danger
          title="Dismiss Admin"
          startContent={<Icon name="deleteUser" title="Dismiss Admin" />}
          onClick={() => {
            dispatch(
              chatsThunks.updateAdmin({
                chatId: member.chatId,
                userId: member.userId,
                adminPermissions: undefined,
              })
            )
            pop()
          }}
        />
      </Section>
    </Column>
  )
}
