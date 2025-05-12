import {FC} from 'react'

import {SingleTransition} from '../../../../shared/ui/Transition/Transition'

import {useAppSelector} from '../../../../app/store'
import {NavigationStack} from '../../../../shared/ui/NavigationStack/NavigationStack'
import {ChatInfo} from './ChatInfo/ChatInfo'

import './RightColumn.scss'

export const RightColumn: FC = () => {
  const isRightColumnActive = useAppSelector(
    (state) => state.ui.isRightColumnActive
  )
  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
  return (
    <SingleTransition
      transitionName="slide"
      animationToggle
      in={isRightColumnActive}
      appear={!!currentChatId}
      timeout={300}
      className="right-column"
    >
      <NavigationStack initialScreen={<ChatInfo />} />
    </SingleTransition>
  )
}
