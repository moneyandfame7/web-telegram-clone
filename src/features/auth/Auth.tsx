import {type FC, useEffect, useState} from 'react'

import {
  persistor,
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../app/store'

import {AuthUsername} from './containers/AuthUsername'
import {AuthPassword} from './containers/AuthPassword'
import {AuthSignUp} from './containers/AuthSignUp'

import {AuthScreen} from './types'
import {authThunks} from './api'

import './Auth.scss'
import {addListener} from '@reduxjs/toolkit'
import {authActions} from './store/auth-slice'

export const Auth: FC = () => {
  const dispatch = useAppDispatch()
  const authScreen = useAppSelector((state) => state.auth.screen)
  const [username, setUsername] = useState('')

  useEffect(() => {
    ;(async () => {
      await dispatch(authThunks.getGeolocation())
    })()
  }, [])

  const renderScreen = () => {
    switch (authScreen) {
      case AuthScreen.Username:
        return <AuthUsername username={username} setUsername={setUsername} />
      case AuthScreen.Password:
        return <AuthPassword username={username} />
      case AuthScreen.SignUp:
        return <AuthSignUp username={username} />
    }
  }

  return <div className="Auth">{renderScreen()}</div>
}
