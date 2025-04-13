import {FC, useState} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {User} from '../../../auth/types'
import {InputText} from '../../../../shared/ui/Input/Input'
import {getUserTitle} from '../../../users/helpers'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'
import {Icon} from '../../../../shared/ui/Icon/Icon'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {Section} from '../../../../shared/ui/Section/Section'
import {FloatButton} from '../../../../shared/ui/FloatButton/FloatButton'

interface EditContactProps {
  user: User
}
export const EditContact: FC<EditContactProps> = ({user}) => {
  const {pop} = useNavigationStack()

  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName ?? '')

  const userTitle = getUserTitle(user)
  return (
    <Column className="chat-management" title="Edit" onGoBack={pop}>
      <Section>
        <Avatar color={user.color} title={userTitle} size="large" />
        <h5 className="chat-management__title">{userTitle}</h5>

        <div className="chat-management__inputs">
          <InputText
            value={firstName}
            onChange={(e) => {
              setFirstName(e.currentTarget.value)
            }}
            label="First name(required)"
          />
          <InputText
            value={lastName}
            onChange={(e) => {
              setLastName(e.currentTarget.value)
            }}
            label="Last name(optional)"
          />
        </div>
      </Section>

      <Section>
        <ListItem
          danger
          fullwidth={false}
          startContent={<Icon name="deleteIcon" title="Delete contact" />}
          title="Delete contact"
          withAvatar={false}
          onClick={() => {}}
        />
      </Section>
      {/* <Button fullWidth color="red" variant="transparent">
        <Icon name="deleteIcon" title="Delete contact" />
        Delete Contact
      </Button> */}

      <FloatButton
        iconName="check"
        title="Edit"
        isVisible={
          firstName !== user.firstName || lastName !== (user.lastName ?? '')
        }
        onClick={() => {}}
      />
    </Column>
  )
}
