import {type FC} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {useAppDispatch, useAppSelector} from '../../../../app/store'
import {Button} from '../../../../shared/ui'
import {authThunks} from '../../../auth/api'
import {usersSelectors} from '../../../users/users-slice'

export const Settings: FC = () => {
  const {pop} = useNavigationStack()
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(usersSelectors.selectCurrentUser)
  return (
    <Column onGoBack={pop} title="Settings">
      <Button
        onClick={async () => {
          await dispatch(authThunks.logOut())
        }}
      >
        Log Out
      </Button>

      {JSON.stringify(currentUser)}
    </Column>
  )
}
