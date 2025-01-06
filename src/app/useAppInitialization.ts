import {useEffect} from 'react'

import {chatsThunks} from '../features/chats/api'
import {createChatListeners} from '../features/chats/listeners'
import {createMessageListeners} from '../features/messages/listeners'
import {usersThunks} from '../features/users/api'

import {uiActions} from '../shared/store/ui-slice'

import {refreshToken} from './api'
import {ServerError} from './error-code.enum'
import {socket} from './socket'
import {useAppDispatch, useAppSelector} from './store'
import {pause} from '../shared/helpers/pause'

/**
 * * Fetch chats, contacts, user data.
 *
 * * Connect to socket.
 */
export const useAppInitialization = () => {
  const dispatch = useAppDispatch()

  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const userId = useAppSelector((state) => state.auth.session?.userId)

  // connect socket to server, provide auth token
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

  // subscribe to events
  useEffect(() => {
    ;(async () => {
      dispatch(uiActions.setIsUpdating(true))
      console.log('INIT')

      if (userId) {
        await dispatch(usersThunks.getUser({id: userId})).unwrap()
      }

      const [chats] = await Promise.all([
        await dispatch(chatsThunks.getChats()).unwrap(),
        await dispatch(usersThunks.getContacts()).unwrap(),
      ])

      socket.on('connect', () => {
        console.warn('[socket.io]: Connected!')
      })
      socket.on('disconnect', () => {
        console.warn('[socket.io]: Disconnected!')
      })

      chats.forEach((chat) => socket.emit('room:join', `chat-${chat.id}`))

      const chatListeners = createChatListeners(dispatch)
      const messageListeners = createMessageListeners(
        dispatch,
        chatListeners.listeners
      )

      chatListeners.subscribe()
      messageListeners.subscribe()

      dispatch(uiActions.setIsUpdating(false))

      return () => {
        chatListeners.unsubscribe()
        messageListeners.unsubscribe()
        socket.off('connect')
        socket.off('disconnect')

        socket.disconnect()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
