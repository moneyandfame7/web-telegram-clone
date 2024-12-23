import {FC} from 'react'
import {useAppSelector} from '../../../../app/store'
import {User} from '../../../auth/types'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'
import {getUserTitle} from '../../../users/helpers'
import {usersSelectors} from '../../../users/state/users-selectors'

interface PrivateChatInfoProps {
  userId: string
}
export const PrivateChatInfo: FC<PrivateChatInfoProps> = ({userId}) => {
  const user = useAppSelector((state) =>
    usersSelectors.selectById(state, userId)
  ) as User | undefined

  return (
    <>
      <Avatar
        color={user?.color}
        title={user ? getUserTitle(user) : undefined}
        size="small"
      />
      <div className="chat-info__content">
        <p className="chat-info__title">
          {user?.firstName + ' ' + (user?.lastName ?? '')}
        </p>
        <p className="chat-info__subtitle">last seen ...</p>
      </div>
    </>
  )
}
