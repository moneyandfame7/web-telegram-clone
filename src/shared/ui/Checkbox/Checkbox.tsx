import {FC} from 'react'
import {Icon} from '../Icon/Icon'

import './Checkbox.scss'
import clsx from 'clsx'
interface CheckboxProps {
  label?: string
  onToggle: (value: boolean) => void
  checked: boolean
  fullWidth?: boolean
}
export const Checkbox: FC<CheckboxProps> = ({
  label,
  onToggle,
  checked,
  fullWidth = true,
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(e.currentTarget.checked)
  }

  const className = clsx('checkbox', {
    'full-width': fullWidth,
  })
  return (
    <label className={className}>
      <div className="checkbox-wrapper">
        <input type="checkbox" onChange={handleOnChange} checked={checked} />
        <Icon title="Check" name="check" color="white" heightAndWidth={15} />
      </div>
      {label && <span className="label">{label}</span>}
    </label>
  )
}
