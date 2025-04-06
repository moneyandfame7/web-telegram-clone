import {FC} from 'react'
import {IconButton} from '../IconButton/IconButton'

import {useNavigationStack} from './useNavigationStack'

import './NavigationBar.scss'
export const NavigationBar: FC = () => {
  const {currentScreen, direction} = useNavigationStack()

  return (
    <div className="navigation-bar">
      {currentScreen.id !== 0 && (
        <IconButton name="arrowLeft" title="Go back" />
      )}
      <h3 className="navigation-bar__title">
        {currentScreen.id}----{direction}
      </h3>
    </div>
  )
}
