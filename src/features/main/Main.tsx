import {type FC, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import {useGetCurrentUser} from '../users/hooks/useGetCurrentUser'
import {useAppDispatch, useAppSelector} from '../../app/store'
import {uiActions} from '../../shared/store/ui-slice'
import {LeftColumn} from './containers/left-column/LeftColumn'

import {MiddleColumn} from './containers/middle-column/MiddleColumn'

import {chatsThunks} from '../chats/api'
import {usersThunks} from '../users/api'

import {ListenEvents, socket} from '../../app/socket'

import './Main.scss'
import {ServerError} from '../../app/error-code.enum'
import {refreshToken} from '../../app/api'
import {chatsActions} from '../chats/state/chats-slice'
import {messagesActions} from '../messages/state/messages-slice'
import {SingleTransition} from '../../shared/ui/Transition/Transition'
import {RightColumn} from './containers/right-column/RightColumn'

console.log('MAIN.tsx')
export const Main: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const getCurrentUser = useGetCurrentUser()

  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
  const rightColumnScreen = useAppSelector(
    (state) => state.ui.rightColumnScreen
  )
  useEffect(() => {
    if (!accessToken) {
      return
    }
    socket.auth = {
      token: accessToken,
    }

    socket.connect()

    socket.on('connect_error', (err) => {
      console.error('CONNECT_ERROR', {err})
      switch (err.message as ServerError) {
        case 'AUTH_TOKEN_EXPIRED':
        case 'AUTH_TOKEN_INVALID':
        case 'AUTH_TOKEN_MISSING':
          console.warn('[socket.io]: Trying to reconnect in 3 seconds...')
          setTimeout(() => {
            refreshToken().then((token) => {
              if (!token) {
                return
              }

              socket.auth = {
                token,
              }
              socket.connect()
            })
          }, 3000)
      }
    })
  }, [accessToken])
  useEffect(() => {
    ;(async () => {
      dispatch(uiActions.setIsUpdating(true))

      console.log('INIT')

      const [, chats] = await Promise.all([
        await getCurrentUser(),
        await dispatch(chatsThunks.getChats()).unwrap(),
        await dispatch(usersThunks.getContacts()).unwrap(),
      ])

      socket.on('connect', () => {
        console.warn('[socket.io]: Connected!')
      })
      socket.on('disconnect', () => {
        console.warn('[socket.io]: Disconnected!')
      })

      chats.forEach((chat) => socket.emit('join', `chat-${chat.id}`))

      const handleOnChatCreated: ListenEvents['chat:created'] = (chat) => {
        console.log(`New chat added: [${chat.id}]`)

        dispatch(chatsActions.addOne(chat))
        socket.emit('join', `chat-${chat.id}`)
      }

      socket.on('chat:created', handleOnChatCreated)

      const handleOnNewMessage: ListenEvents['onNewMessage'] = (
        message,
        chat
      ) => {
        console.log(`New message ${message.id} in chat ${chat.id}`)

        dispatch(messagesActions.addMessage({chatId: chat.id, message}))
      }

      socket.on('onNewMessage', handleOnNewMessage)

      dispatch(uiActions.setIsUpdating(false))

      return () => {
        socket.off('chat:created', handleOnChatCreated)
        socket.off('onNewMessage')
        socket.off('connect')
        socket.disconnect()
      }
    })()
  }, [])

  useEffect(() => {
    if (currentChatId) {
      navigate(`/${currentChatId}`)
    } else {
      navigate('/')
    }
  }, [currentChatId])

  return (
    <div className="main">
      <LeftColumn />
      <MiddleColumn />
      <RightColumn />
    </div>
  )
}
