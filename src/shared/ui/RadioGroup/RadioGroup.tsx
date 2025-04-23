import {FC} from 'react'

import {ListItem} from '../ListItem/ListItem'
import './RadioGroup.scss'

export interface RadioGroupItem {
  value: string
  title: string
  subtitle?: string
}
interface RadioGroupProps {
  values: RadioGroupItem[]
  onChange: (value: string) => void
  value: string
  disabled?: boolean
  loadingFor?: string
}

export const RadioGroup: FC<RadioGroupProps> = ({
  values,
  onChange,
  value,
  disabled,
  loadingFor,
}) => (
  <div className="radio-group">
    {values.map((v) => (
      <ListItem
        withAvatar={false}
        disabled={disabled}
        key={v.value}
        onClick={() => {
          if (!loadingFor) {
            onChange(v.value)
          }
        }}
        title={v.title}
        subtitle={v.subtitle}
        startContent={
          <label
            className={`radio-group__option${
              loadingFor === v.value ? ' radio-group__option--loading' : ''
            }`}
          >
            <input
              className="radio-group__input"
              checked={value === v.value}
              type="radio"
            />
            <span className="radio-group__custom" />
          </label>
        }
      />
    ))}
  </div>
)
