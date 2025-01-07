import {type FC, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import {useAppDispatch} from '../../app/store'
import {useAppInitialization} from '../../app/useAppInitialization'

import {LeftColumn} from './containers/left-column/LeftColumn'
import {MiddleColumn} from './containers/middle-column/MiddleColumn'
import {RightColumn} from './containers/right-column/RightColumn'

import {isUserId} from '../users/helpers'

import {chatsThunks} from '../chats/api'
import {chatsActions} from '../chats/state/chats-slice'

import {usePrevious} from '../../shared/hooks/usePrevious'
import {isUUID} from '../../shared/helpers/isUUID'

import './Main.scss'
import {useEventListener} from '../../shared/hooks/useEventListener'

console.log('MAIN.tsx')
export const Main: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {chatId} = useParams() as {chatId: string}
  const previousChatId = usePrevious(chatId)

  useAppInitialization()

  useEffect(() => {
    if (chatId) {
      if (isUserId(chatId) || isUUID(chatId)) {
        dispatch(chatsThunks.openChat({id: chatId}))
      } else {
        navigate({pathname: '/'}, {replace: true})
      }
      // значить що закрили чат
    } else if (previousChatId) {
      dispatch(chatsActions.setCurrentChat(undefined))
    }
  }, [chatId])

  useEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      navigate({pathname: '/'})
    }
  })

  return (
    <div className="main">
      <LeftColumn />
      <MiddleColumn />
      <RightColumn />
    </div>
  )
}
