import {FC} from 'react'

import {SingleTransition} from '../../../../shared/ui/Transition/Transition'

import './RightColumn.scss'
import {useAppDispatch, useAppSelector} from '../../../../app/store'
import {Column} from '../../../../shared/ui/Column/Column'
import {uiActions} from '../../../../shared/store/ui-slice'

export const RightColumn: FC = () => {
  const dispatch = useAppDispatch()
  const rightColumnScreen = useAppSelector(
    (state) => state.ui.rightColumnScreen
  )
  const currentChatId = useAppSelector((state) => state.chats.currentChatId)
  return (
    <SingleTransition
      transitionName="slide"
      animationToggle
      in={rightColumnScreen !== undefined}
      appear={!!currentChatId}
      timeout={300}
      className="right-column"
    >
      <Column
        onGoBack={() => {
          dispatch(uiActions.setRightColumn())
        }}
      ></Column>
    </SingleTransition>
  )
}
