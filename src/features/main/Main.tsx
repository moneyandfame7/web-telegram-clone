import {type FC, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import {useGetCurrentUser} from '../users/hooks/useGetCurrentUser'
import {useAppDispatch, useAppSelector} from '../../app/store'
import {setIsUpdating} from '../../shared/store/ui-slice'
import {LeftColumn} from './containers/left-column/LeftColumn'

import {MiddleColumn} from './containers/middle-column/MiddleColumn'

import {chatsThunks} from '../chats/api'
import {usersThunks} from '../users/api'

import {ListenEvents, socket} from '../../app/socket'
import {chatsActions} from '../chats/chats-slice'

import './Main.scss'
import {ServerError} from '../../app/error-code.enum'
import {refreshToken} from '../../app/api'

console.log('MAIN.tsx')
export const Main: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const getCurrentUser = useGetCurrentUser()

  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
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
      dispatch(setIsUpdating(true))

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

      dispatch(setIsUpdating(false))

      return () => {
        socket.off('chat:created', handleOnChatCreated)
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
      <div className="right-column"></div>
    </div>
  )
}
