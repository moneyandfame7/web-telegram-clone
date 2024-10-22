import {type FC, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import {useGetCurrentUser} from '../users/hooks/useGetCurrentUser'
import {useAppDispatch, useAppSelector} from '../../app/store'
import {setIsUpdating} from '../../shared/store/ui-slice'
import {LeftColumn} from './containers/left-column/LeftColumn'

import {MiddleColumn} from './containers/middle-column/MiddleColumn'

import {chatsThunks} from '../chats/api'

import './Main.scss'
import {usersThunks} from '../users/api'

export const Main: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const getCurrentUser = useGetCurrentUser()

  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
  useEffect(() => {
    ;(async () => {
      dispatch(setIsUpdating(true))
      await Promise.all([
        await getCurrentUser(),
        await dispatch(chatsThunks.getChats()).unwrap(),
        await dispatch(usersThunks.getContacts()).unwrap(),
      ])

      dispatch(setIsUpdating(false))
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
