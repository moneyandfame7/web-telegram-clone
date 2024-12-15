import {useCallback, useLayoutEffect, useState} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import {AppScreen} from '../shared/types/ui-types'
import {Auth} from '../features/auth/Auth'

import {useAppSelector} from './store'
import {Chat} from '../features/chats/Chat'
import {Main} from '../features/main/Main'

function App() {
  const session = useAppSelector((state) => state.auth.session)
  const [rootScreen, setRootScreen] = useState(AppScreen.Loading)

  useLayoutEffect(() => {
    if (session) {
      setRootScreen(AppScreen.Chat)
    } else {
      setRootScreen(AppScreen.Auth)
    }
  }, [session])

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
    }
  }, [rootScreen])

  return (
    <div
      className="hui"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {renderScreen()}
    </div>
  )
}

export default App
