import {FC, useCallback, useLayoutEffect, useState} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import {AppScreen} from '../shared/types/ui-types'
import {Auth} from '../features/auth/Auth'

import {useAppSelector} from './store'
import {Chat} from '../features/chats/Chat'
import {Main} from '../features/main/Main'
import {Transition} from '../shared/ui/Transition/Transition'
import {Spinner} from '../shared/ui/Spinner/Spinner'

import './App.scss'
interface AppProps {
  bootstrapped: boolean
}

export const App: FC<AppProps> = ({bootstrapped}) => {
  const session = useAppSelector((state) => state.auth.session)
  const [rootScreen, setRootScreen] = useState(AppScreen.Loading)

  useLayoutEffect(() => {
    console.log('UPDATE!!', {bootstrapped})
    if (!bootstrapped) {
      setRootScreen(AppScreen.Loading)
    } else if (session) {
      setRootScreen(AppScreen.Chat)
    } else {
      setRootScreen(AppScreen.Auth)
    }
  }, [session, bootstrapped])

  const renderScreen = useCallback(() => {
    switch (rootScreen) {
      case AppScreen.Auth:
        return <Auth />
      case AppScreen.Chat:
        return (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />}>
                <Route path="/:chatId" element={<Chat />} />

                <Route index element={<div>Select a chat from the list</div>} />
              </Route>
            </Routes>
          </BrowserRouter>
        )
      case AppScreen.Loading:
        return (
          <div className="app-loading">
            <Spinner size="medium" color="primary" />
          </div>
        )
    }
  }, [rootScreen])

  return (
    <Transition
      shouldCleanup
      activeKey={rootScreen}
      transitionName="fade"
      timeout={200}
    >
      {renderScreen()}
    </Transition>
  )
}

export default App
