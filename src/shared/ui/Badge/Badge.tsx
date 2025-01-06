import clsx from 'clsx'
import {FC} from 'react'

import './Badge.scss'
interface BadgeProps {
  number: number
}
export const Badge: FC<BadgeProps> = ({number}) => {
  const className = clsx('badge', {
    'badge--capsule': number >= 100,
  })
  return <span className={className}>{number}</span>
}
