import {FC} from 'react'
import {Size} from '../../types/ui-types'

import './Toggle.scss'
interface ToggleProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  size?: Size
}
export const Toggle: FC<ToggleProps> = ({
  checked,
  onChange,
  size = 'medium',
}) => {
  return (
    <div className={`toggle toggle--${size}`}>
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
