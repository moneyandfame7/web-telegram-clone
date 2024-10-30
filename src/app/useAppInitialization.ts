import {useEffect} from 'react'

import {useGetCurrentUser} from '../features/users/hooks/useGetCurrentUser'
import {chatsThunks} from '../features/chats/api'
import {usersThunks} from '../features/users/api'

import {useAppDispatch} from './store'

export const useAppInitialization = () => {
  const dispatch = useAppDispatch()
  const getCurrentUser = useGetCurrentUser()

  useEffect(() => {
    ;(async () => {
      const [user] = await Promise.all([
        await getCurrentUser(),
        await dispatch(chatsThunks.getChats()).unwrap(),
        await dispatch(usersThunks.getContacts()).unwrap(),
      ])
    })()
  }, [])
}
