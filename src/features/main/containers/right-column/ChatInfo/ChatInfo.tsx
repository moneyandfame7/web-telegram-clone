import {FC} from 'react'
import {Column} from '../../../../../shared/ui/Column/Column'
import {useAppDispatch, useAppSelector} from '../../../../../app/store'
import {uiActions} from '../../../../../shared/store/ui-slice'
import {IconButton} from '../../../../../shared/ui/IconButton/IconButton'
import {useNavigationStack} from '../../../../../shared/ui/NavigationStack/useNavigationStack'
import {chatsSelectors} from '../../../../chats/state'
import {usersSelectors} from '../../../../users/state/users-selectors'
import {User} from '../../../../auth/types'
import {EditContact} from '../EditContact'
import {ChatEdit} from '../ChatEdit'
import {Section} from '../../../../../shared/ui/Section/Section'
import {ListItem} from '../../../../../shared/ui/ListItem/ListItem'
import {Icon} from '../../../../../shared/ui/Icon/Icon'
import {getUserTitle} from '../../../../users/helpers'
import {Avatar} from '../../../../../shared/ui/Avatar/Avatar'

export const ChatInfo: FC = () => {
  const {push} = useNavigationStack()
  const dispatch = useAppDispatch()
  const currentChat = useAppSelector(chatsSelectors.selectCurrentChat)
  const isPrivate = Boolean(currentChat?.userId)

  const user = useAppSelector((state) =>
    usersSelectors.selectById(
      state,
      isPrivate && currentChat ? currentChat.userId! : ''
    )
  ) as User | undefined
  const userTitle = user ? getUserTitle(user) : undefined

  function renderHeader() {
    if (user) {
      if (user.isContact) {
        return (
          <IconButton
            name="edit"
            title="Edit"
            onClick={() => {
              push(<EditContact user={user} />)
            }}
          />
        )
      }
      return (
        <IconButton
          name="addUser"
          title="Add a Contact"
          onClick={() => {
            // open modal
          }}
        />
      )
    } else if (currentChat?.isOwner) {
      return (
        <IconButton
          name="edit"
          title="Edit"
          onClick={() => {
            push(<ChatEdit chat={currentChat} />)
          }}
        />
      )
    }
  }
  return (
    <Column
      className="chat-management"
      onGoBack={() => {
        dispatch(uiActions.setRightColumn())
      }}
      title={user ? 'User Info' : 'Chat Info'}
      header={renderHeader()}
    >
      {currentChat && (
        <Section>
          {user ? (
            <Avatar color={user.color} title={userTitle} size="large" />
          ) : (
            <Avatar
              color={currentChat.color}
              title={currentChat.title}
              size="large"
            />
          )}
          {user ? (
            <>
              <h5 className="chat-management__title">{userTitle}</h5>
              <span className="chat-management__subtitle">[user status]</span>
            </>
          ) : (
            <>
              <h5 className="chat-management__title">{currentChat.title}</h5>
              <span className="chat-management__subtitle">
                {currentChat.membersCount} members
              </span>
            </>
          )}

          {currentChat?.description && (
            <ListItem
              startContent={<Icon name="info" title="Info" size="large" />}
              title={currentChat.description}
              subtitle="Info"
              onClick={() => {}}
            />
          )}
          {user?.username && (
            <ListItem
              startContent={
                <Icon name="username" title="Username" size="large" />
              }
              withAvatar={false}
              onClick={() => {}}
              title={user.username}
              subtitle="Username"
            />
          )}
          <ListItem
            startContent={<Icon name="unmute" title="Notification" />}
            withAvatar={false}
            title="Notifications"
            titleRight={'TOGGLE INPUT'}
            onClick={() => {}}
          />
        </Section>
      )}
    </Column>
  )
}
