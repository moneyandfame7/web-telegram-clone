import {type FC, useState} from 'react'
import {Button} from '../../../shared/ui'
import {useAppDispatch, useAppSelector} from '../../../app/store'
import {authThunks} from '../api'
import {InputText} from '../../../shared/ui/Input/Input'

interface AuthPasswordProps {
  username: string
}
export const AuthPassword: FC<AuthPasswordProps> = ({username}) => {
  const dispatch = useAppDispatch()
  const [password, setPassword] = useState('')
  const isLoading = useAppSelector((state) => state.auth.isLoading)
  const deviceInfo = useAppSelector((state) => state.auth.deviceInfo)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    try {
      await dispatch(
        authThunks.signIn({
          password,
          username,
          deviceInfo,
        })
      ).unwrap()
    } catch (error) {
      setError(error as string)
    }
  }

  return (
    <div className="Auth-container AuthPassword">
      <h4>Enter a Password ({username})</h4>
      <p className="text-secondary">
        Your account is protected with a password
      </p>

      {error && <h3>ERROR: {error}</h3>}
      <div className="form-wrapper">
        <InputText
          value={password}
          label="Password"
          onChange={(e) => {
            setPassword(e.currentTarget.value)
          }}
        />

        {password && (
          <Button
            fullWidth
            isLoading={isLoading}
            onClick={async () => {
              await handleSubmit()
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
