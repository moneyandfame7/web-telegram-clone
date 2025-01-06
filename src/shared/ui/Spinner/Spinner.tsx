import {FC} from 'react'
import clsx from 'clsx'

import {Size} from '../../types/ui-types'

import './Spinner.scss'

export type SpinnerColor = 'primary' | 'neutral' | 'yellow' | 'white'

interface SpinnerProps {
  size?: Size
  color?: SpinnerColor
}
export const Spinner: FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
}) => {
  const buildedClassname = clsx(
    'spinner',
    `spinner-${size}`,
    `spinner-${color}`,
    {}
  )

  return (
    <div className={buildedClassname}>
      <span className="spinner-inner" />
    </div>
  )
}
