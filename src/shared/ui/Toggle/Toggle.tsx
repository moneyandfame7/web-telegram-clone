import {FC} from 'react'
import {Size} from '../../types/ui-types'

import clsx from 'clsx'

import './Toggle.scss'

interface ToggleProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  size?: Size
  danger?: boolean
}
export const Toggle: FC<ToggleProps> = ({
  checked,
  onChange,
  size = 'medium',
  danger,
}) => {
  const toggleClassname = clsx('toggle', `toggle--${size}`, {
    'toggle--danger': danger,
  })
  return (
    <div className={toggleClassname}>
      <input
        className="toggle__input"
        id="toggle"
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange?.(e.currentTarget.checked)
        }}
      />
      <label className="toggle__label" htmlFor="toggle" />
    </div>
  )
}
