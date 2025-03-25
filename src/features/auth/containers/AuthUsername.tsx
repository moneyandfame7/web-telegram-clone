import {type FC} from 'react'
import {Button} from '../../../shared/ui'
import {useAppDispatch, useAppSelector} from '../../../app/store'
import {usersThunks} from '../../users/api'
import {authActions} from '../store/auth-slice'
import {AuthScreen} from '../types'
import {InputText} from '../../../shared/ui/Input/Input'
import TelegramLogo from '../../../assets/images/telegram-logo.svg?react'
import {Checkbox} from '../../../shared/ui/Checkbox/Checkbox'
interface AuthUsernameProps {
  username: string
  setUsername: (value: string) => void
}
export const AuthUsername: FC<AuthUsernameProps> = ({
  username,
  setUsername,
}) => {
  const dispatch = useAppDispatch()

  const keepSignedIn = useAppSelector((state) => state.auth.keepSignedIn)

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
      {<TelegramLogo className="logo" />}
      <h4>Sign in to Telegram clone</h4>
      <p className="text-secondary">Please enter your username.</p>

      <div className="form-wrapper">
        <InputText
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value)
          }}
        />

        <Checkbox
          checked={keepSignedIn}
          onToggle={(val) => {
            dispatch(authActions.setKeepSignedIn(val))
          }}
          label="Keep me signed in"
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
