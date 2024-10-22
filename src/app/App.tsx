import {useCallback, useLayoutEffect, useState} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import {AppScreen} from '../shared/types/ui-types'
import {Auth} from '../features/auth/Auth'
import {Main} from '../features/main/Main'
import {Chat} from '../features/chats/Chat'

import {useAppSelector} from './store'

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
                <Route index element={<div>Select a chat from the list</div>} />

                <Route path="/:chatId" element={<Chat />} />
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
