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
    'Spinner',
    `Spinner-${size}`,
    `Spinner-${color}`,
    {}
  )

  return (
    <div className={buildedClassname}>
      <span className="Spinner-inner" />
    </div>
  )
}
