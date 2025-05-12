import {FC} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {Section} from '../../../../shared/ui/Section/Section'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {
  Chat,
  ChatInviteLinks as ChatInviteLinksType,
} from '../../../chats/types'
import {composeInviteLink} from '../../../chats/helpers'
import {Button} from '../../../../shared/ui'
import {InviteLinkContainer} from '../../../chats/components/InviteLinkContainer/InviteLinkContainer'
import {Icon} from '../../../../shared/ui/Icon/Icon'
import {EditInviteLink} from './EditInviteLink'
import {useAppSelector} from '../../../../app/store'
import {chatsSelectors} from '../../../chats/state'
import {ChatInviteLinkInfo} from './ChatInviteLinkInfo'

interface ChatInviteLinksProps {
  chat: Chat
  inviteLinks: ChatInviteLinksType
}
export const ChatInviteLinks: FC<ChatInviteLinksProps> = ({chat}) => {
  const {pop, push} = useNavigationStack()
  const inviteLinks = useAppSelector((state) =>
    chatsSelectors.selectChatInviteLinks(state, chat.id)
  )

  if (!inviteLinks) {
    return
  }
  return (
    <Column title="Invite Links" onGoBack={pop}>
      <h5>[lottie animation here]</h5>
      <h3 className="section__subheading">
        Everyone will be able to join your channel by following this link.
      </h3>

      <InviteLinkContainer
        title="Primary Link"
        fullLink={composeInviteLink(inviteLinks.primary.id)}
      />

      <Section>
        <h2 className="section__heading">Additional Links</h2>
        <Button
          uppercase={false}
          variant="transparent"
          onClick={() => {
            push(<EditInviteLink chat={chat} />)
          }}
        >
          <Icon title="Create" name="plus" />
          Create a New Link
        </Button>
        {inviteLinks.additional.map((link) => (
          <ListItem
            startContent={
              <Icon
                name="link"
                title="Link"
                size="medium"
                variant="contained"
              />
            }
            key={link.id}
            withAvatar={false}
            title={link.name || composeInviteLink(link.id)}
            subtitle={
              link.joinedCount > 0
                ? `${link.joinedCount} joined`
                : 'No one joined'
            }
            onClick={() => {
              push(<ChatInviteLinkInfo chat={chat} inviteLink={link} />)
            }}
          />
        ))}
      </Section>
      <h3 className="section__subheading">
        You can create additional invite links that have a limited time or
        number of users.
      </h3>
    </Column>
  )
}
