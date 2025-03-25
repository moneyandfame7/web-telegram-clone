import {FC, MouseEventHandler, PropsWithChildren} from 'react'

import clsx from 'clsx'

import {Spinner} from '../Spinner/Spinner'
import type {Size} from '../../types/ui-types'

import './Button.scss'

export interface ButtonProps extends PropsWithChildren {
  isDisabled?: boolean
  isLoading?: boolean
  loadingText?: string
  size?: Size
  fullWidth?: boolean

  iconPosition?: 'start' | 'end'

  variant?: 'contained' | 'transparent'
  color?: 'primary' | 'red' | 'green' | 'gray'
  uppercase?: boolean

  onClick?: MouseEventHandler
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  uppercase = size !== 'small',
  loadingText,
  isLoading,
  isDisabled,
  fullWidth,
  onClick,
}) => {
  const buildClass = clsx(
    'button',
    `button--${size}`,
    `button--${color}`,
    `button--${variant}`,
    {
      'button--loading': isLoading,
      'button--fullWidth': fullWidth,
      'button--uppercase': uppercase,
    }
  )
  return (
    <button
      className={buildClass}
      onClick={onClick}
      disabled={isLoading || isDisabled}
    >
      {children}

      {isLoading && (
        <>
          {loadingText}
          <Spinner
            color={variant === 'contained' ? 'white' : 'primary'}
            size="small"
          />
        </>
      )}
    </button>
  )
}
