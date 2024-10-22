import {FC} from 'react'
import {ChatColor} from '../../../app/types'
import clsx from 'clsx'
import {Size} from '../../types/ui-types'

import './Avatar.scss'
interface AvatarProps {
  url?: string
  color?: ChatColor
  title?: string
  size?: Size
}
export const Avatar: FC<AvatarProps> = ({
  url,
  color = 'BLUE',
  size = 'medium',
  title,
}) => {
  const renderContent = () => {
    if (url) {
      return <img src={url} alt={title} />
    }

    return title?.slice(0, 2).toUpperCase()
  }

  const buildedClassname = clsx(
    'avatar',
    `avatar--${color.toLowerCase()}`,
    `avatar--${size}`
  )
  return <div className={buildedClassname}>{renderContent()}</div>
}
