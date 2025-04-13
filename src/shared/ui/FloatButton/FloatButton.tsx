import {FC} from 'react'
import {IconButton} from '../IconButton/IconButton'
import {IconName} from '../Icon/Icon'

import './FloatButton.scss'
import clsx from 'clsx'
interface FloatButtonProps {
  iconName: IconName
  isVisible: boolean
  title: string
  onClick: VoidFunction
}
export const FloatButton: FC<FloatButtonProps> = ({
  iconName,
  title,
  onClick,
  isVisible,
}) => {
  const className = clsx('float-button', {
    'is-visible': isVisible,
  })
  return (
    <IconButton
      className={className}
      name={iconName}
      title={title}
      onClick={onClick}
      color="white"
      size="large"
      variant="primary"
    />
  )
}
