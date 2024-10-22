import {type FC} from 'react'
import {Button} from '../../../shared/ui'
import {useAppDispatch} from '../../../app/store'
import {usersThunks} from '../../users/api'
import {authActions} from '../store/auth-slice'
import {AuthScreen} from '../types'

interface AuthUsernameProps {
  username: string
  setUsername: (value: string) => void
}
export const AuthUsername: FC<AuthUsernameProps> = ({
  username,
  setUsername,
}) => {
  const dispatch = useAppDispatch()

  const handleGoNext = async () => {
    const isUsernameExist = await dispatch(
      usersThunks.checkUsername({username})
    ).unwrap()

    const nextScreen: AuthScreen = isUsernameExist
      ? AuthScreen.Password
      : AuthScreen.SignUp

    dispatch(authActions.setScreen(nextScreen))
  }

  return (
    <div className="Auth-container AuthUsername">
      <h4>Sign in to Telegram clone</h4>
      <p className="text-secondary">Please enter your username</p>

      <div className="form-wrapper">
        <input
          value={username}
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.currentTarget.value)
          }}
        />

        {username && (
          <Button
            fullWidth
            onClick={() => {
              handleGoNext()
              // dispatch(authActions.setScreen(AuthScreen.Password))
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
