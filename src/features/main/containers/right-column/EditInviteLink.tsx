import {FC, useState} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {Section} from '../../../../shared/ui/Section/Section'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {useBoolean} from '../../../../shared/hooks/useBoolean'
import {InputText} from '../../../../shared/ui/Input/Input'
import {Chat, ChatInviteLink} from '../../../chats/types'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {RadioGroup} from '../../../../shared/ui/RadioGroup/RadioGroup'
import {Button} from '../../../../shared/ui'
import {FloatButton} from '../../../../shared/ui/FloatButton/FloatButton'
import {useAppDispatch} from '../../../../app/store'
import {chatsThunks} from '../../../chats/api'

interface EditInviteLinkProps {
  chat: Chat
  linkToEdit?: ChatInviteLink
}
export const EditInviteLink: FC<EditInviteLinkProps> = ({chat, linkToEdit}) => {
  const dispatch = useAppDispatch()
  const {pop} = useNavigationStack()
  const {value: requestNeeded, toggle: toggleRequestNeeded} = useBoolean(
    linkToEdit?.adminApproval
  )
  const {value: isLoading, toggle: toggleIsLoading} = useBoolean()
  const [name, setName] = useState(linkToEdit?.name ?? '')
  const [limitUserCount, setLimitUserCount] = useState<string>('nolimit')
  const [expiresAt, setExpiresAt] = useState<string>('nolimit')

  const isEdited =
    requestNeeded !== linkToEdit?.adminApproval || name !== linkToEdit.name
  return (
    <Column title={`${linkToEdit ? 'Edit' : 'New'} Invite Link`} onGoBack={pop}>
      <Section>
        <ListItem
          withAvatar={false}
          title="Request needed"
          subtitle="Turn this on if you want users to join only after they are approved by an admin."
          checked={requestNeeded}
          onClick={toggleRequestNeeded}
        />
      </Section>

      <Section>
        <InputText
          label="Link Name (optional)"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value)
          }}
        />
      </Section>
      <h3 className="section__subheading">Only admins will see this name.</h3>

      <Section>
        <h2 className="section__heading">Limit by time period</h2>
        <RadioGroup
          onChange={(value) => {
            setExpiresAt(value)
          }}
          value={expiresAt}
          values={[
            {
              title: 'No Limit',
              value: 'nolimit',
            },
            {
              title: '1 hour',
              value: '1hour',
            },
            {
              title: '1 day',
              value: '1day',
            },
            {
              title: '1 week',
              value: '1 week',
            },
            {
              title: 'Custom',
              value: 'custom',
            },
          ]}
        />
        {expiresAt === 'custom' && (
          <Button variant="transparent">CALENDAR OPEN!!! (NOT WORK)</Button>
        )}
      </Section>
      <h3 className="section__subheading">
        You can make the link expire after a certain time.
      </h3>

      <Section>
        <h2 className="section__heading">Limit by number of users</h2>
        <RadioGroup
          onChange={(value) => {
            setLimitUserCount(value)
          }}
          value={limitUserCount}
          values={[
            {
              title: 'No Limit',
              value: 'nolimit',
            },
            {
              title: '1 user',
              value: '1user',
            },
            {
              title: '10 users',
              value: '10users',
            },
            {
              title: '100 users',
              value: '100users',
            },
            {
              title: 'Custom',
              value: 'custom',
            },
          ]}
        />
        {limitUserCount === 'custom' && (
          <Button variant="transparent">
            CUSTOM NUMBER INPUT!!! (NOT WORK)
          </Button>
        )}
      </Section>
      <h3 className="section__subheading">
        You can make the link work only for a certain number of users.
      </h3>

      <FloatButton
        iconName="check1"
        isVisible
        isLoading={isLoading}
        title="Create a new link"
        onClick={async () => {
          if (linkToEdit) {
            if (!isEdited) {
              return
            }
            return
            // await dispatch(chatsThunks.edit)
          }

          toggleIsLoading()

          await dispatch(
            chatsThunks.createChatInviteLink({
              chatId: chat.id,
              adminApproval: requestNeeded,
              // expiresAt,
              // limitUserCount,
              name,
            })
          ).unwrap()
          toggleIsLoading()
        }}
      />
    </Column>
  )
}
