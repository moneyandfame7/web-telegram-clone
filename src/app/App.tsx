import {FC, useCallback, useLayoutEffect, useState} from 'react'
import {Route, Routes, useLocation} from 'react-router-dom'

import {AppScreen} from '../shared/types/ui-types'
import {Auth} from '../features/auth/Auth'

import {useAppSelector} from './store'
import {Chat} from '../features/chats/Chat'
import {Main} from '../features/main/Main'
import {Transition} from '../shared/ui/Transition/Transition'
import {Spinner} from '../shared/ui/Spinner/Spinner'

import './App.scss'
import {TestModal} from '../features/chats/components/TestModal/TestModal'
interface AppProps {
  bootstrapped: boolean
}

export const App: FC<AppProps> = ({bootstrapped}) => {
  const session = useAppSelector((state) => state.auth.session)
  const [rootScreen, setRootScreen] = useState(AppScreen.Loading)
  const location = useLocation()
  const previousLocation = location.state?.previousLocation

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
        return <Main />
      case AppScreen.Loading:
        return (
          <div className="app-loading">
            <Spinner size="medium" color="primary" />
          </div>
        )
    }
  }, [rootScreen])

  return (
    <>
      <Routes location={previousLocation || location}>
        <Route
          path="/"
          element={
            <Transition
              shouldCleanup
              activeKey={rootScreen}
              transitionName="fade"
              timeout={200}
            >
              {renderScreen()}
            </Transition>
          }
        >
          {/* <Route index element={<div>Select a chat from the list</div>} /> */}
          <Route path="*" element={<h1>NO MATCH</h1>} />
          <Route path="/:chatId" element={<Chat />} />
          <Route path="/chat-invite/:inviteId" element={<TestModal />} />
        </Route>
        <Route />
      </Routes>
      {previousLocation && (
        <Routes>
          <Route path="/chat-invite/:inviteId" element={<TestModal />} />
        </Routes>
      )}
    </>
  )
}

export default App
