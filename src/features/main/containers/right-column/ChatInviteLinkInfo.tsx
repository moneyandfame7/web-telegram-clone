import {FC, useEffect} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {Chat, ChatInviteLink, JoinedMemberViaLink} from '../../../chats/types'
import {EditInviteLink} from './EditInviteLink'
import {InviteLinkContainer} from '../../../chats/components/InviteLinkContainer/InviteLinkContainer'
import {composeInviteLink} from '../../../chats/helpers'
import {Section} from '../../../../shared/ui/Section/Section'
import {useAppSelector} from '../../../../app/store'
import {usersSelectors} from '../../../users/state/users-selectors'
import {User} from '../../../auth/types'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {getUserTitle} from '../../../users/helpers'
import {formatMessageTime} from '../../../messages/helpers'
import {api} from '../../../../app/api'

export function formatInviteDate(date: Date): string {
  const now = new Date()

  const isSameDay = date.toDateString() === now.toDateString()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)

  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (isSameDay) {
    return `Today at ${time}`
  }

  if (isYesterday) {
    return `Yesterday at ${time}`
  }

  return `${date.toLocaleDateString()} at ${time}`
}
interface ChatInviteLinkInfoProps {
  chat: Chat
  inviteLink: ChatInviteLink
}
export const ChatInviteLinkInfo: FC<ChatInviteLinkInfoProps> = ({
  chat,
  inviteLink,
}) => {
  const {pop, push} = useNavigationStack()
  const linkCreator = useAppSelector((state) =>
    usersSelectors.selectById(state, inviteLink.createdByUserId ?? '')
  ) as User | undefined
  //  const [joinedMembers,setJoinedMembers]=useState<User[]|undefined>(undefined)
  useEffect(() => {
    api
      .get<JoinedMemberViaLink[]>(
        `/chats/${chat.id}/invite-links/${inviteLink.id}/joined`
      )
      .then((res) => {
        console.log(res.data)
      })
  }, [])
  return (
    <Column
      onGoBack={pop}
      title="Invite Link"
      header={
        <IconButton
          name="edit"
          title="Edit"
          onClick={() => {
            push(<EditInviteLink chat={chat} linkToEdit={inviteLink} />)
          }}
        />
      }
    >
      <InviteLinkContainer
        fullLink={composeInviteLink(inviteLink.id)}
        title="Invite Link"
      />

      <Section>
        <h2 className="section__heading">Link created by</h2>

        {linkCreator && (
          <ListItem
            withAvatar
            avatarSize="small"
            title={getUserTitle(linkCreator)}
            // subtitle={formatMessageTime({
            //   date: new Date(inviteLink.createdAt),
            //   // onlyTime: false,
            //   // withToday: true,
            // })}
            subtitle={formatInviteDate(new Date(inviteLink.createdAt))}
            onClick={() => {}}
          />
        )}
      </Section>
    </Column>
  )
}
