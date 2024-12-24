import {type FC, useState} from 'react'
import {Button} from '../../../shared/ui'
import {useAppDispatch, useAppSelector} from '../../../app/store'
import {authThunks} from '../api'
import {USER_BROWSER, USER_PLATFORM} from '../../../app/environment'
import {InputText} from '../../../shared/ui/Input/Input'

interface AuthSignUpProps {
  username: string
}
export const AuthSignUp: FC<AuthSignUpProps> = ({username}) => {
  const dispatch = useAppDispatch()

  const isLoading = useAppSelector((state) => state.auth.isLoading)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const handleNext = async () => {
    await dispatch(
      authThunks.signUp({
        username,
        firstName,
        lastName,
        password,
        passwordConfirm,
        deviceInfo: {
          ip: '123',
          browser: USER_BROWSER,
          location: 'location',
          platform: USER_PLATFORM,
        },
      })
    ).unwrap()
  }

  const canGoNext =
    username.length > 3 &&
    firstName.length > 3 &&
    password.length > 4 &&
    password === passwordConfirm
  return (
    <div className="Auth-container AuthSignUp">
      <h4>Sign up</h4>
      <p className="text-secondary">
        Please enter your name and add a profile picture.
      </p>

      <div className="form-wrapper">
        <InputText
          value={firstName}
          label="Name"
          onChange={(e) => {
            setFirstName(e.currentTarget.value)
          }}
        />

        <InputText
          value={lastName}
          label="Last Name (optional)"
          onChange={(e) => {
            setLastName(e.currentTarget.value)
          }}
        />
        <input
          value={password}
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.currentTarget.value)
          }}
        />
        <input
          value={passwordConfirm}
          placeholder="Password confirm"
          onChange={(e) => {
            setPasswordConfirm(e.currentTarget.value)
          }}
        />

        {canGoNext && (
          <Button
            fullWidth
            isLoading={isLoading}
            onClick={async () => {
              await handleNext()
            }}
          >
            Start messaging
          </Button>
        )}
      </div>
    </div>
  )
}
