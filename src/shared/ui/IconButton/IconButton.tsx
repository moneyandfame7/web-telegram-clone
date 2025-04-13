import type {CSSProperties, FC} from 'react'
import clsx from 'clsx'

import {Icon, type IconProps} from '../Icon/Icon'

import {Spinner} from '../Spinner/Spinner'

import './IconButton.scss'

interface IconButtonProps extends IconProps {
  variant?: 'primary' | 'transparent'
  style?: CSSProperties
  isLoading?: boolean
}
export const IconButton: FC<IconButtonProps> = ({
  variant = 'transparent',
  size,
  style,
  isLoading,
  className,
  ...iconProps
}) => {
  const buildedClass = clsx(
    'icon-button',
    className,
    {
      'icon-button--loading': isLoading,
    },
    variant,
    size
  )
  return (
    <button className={buildedClass} style={style}>
      {isLoading ? (
        <Spinner color="white" size="small" />
      ) : (
        <Icon {...iconProps} size={size} />
      )}
    </button>
  )
}
