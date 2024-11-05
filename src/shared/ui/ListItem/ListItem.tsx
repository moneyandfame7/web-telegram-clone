import {MouseEvent, type FC} from 'react'
import {Avatar} from '../Avatar/Avatar'

import {ChatColor} from '../../../app/types'

import clsx from 'clsx'

import './ListItem.scss'

interface ListItemProps {
  title: string
  titleRight?: string
  subtitle?: string
  subtitleRight?: string
  onClick: (e: MouseEvent<HTMLDivElement>) => void

  avatarUrl?: string
  itemColor?: ChatColor

  checked?: boolean
  selected?: boolean
}
export const ListItem: FC<ListItemProps> = ({
  title,
  titleRight,
  subtitle,
  subtitleRight,
  onClick,

  avatarUrl,
  itemColor,
  checked,
  selected,
}) => {
  const className = clsx('list-item', {
    'list-item--selected': selected,
  })
  return (
    <div className={className} onClick={onClick}>
      {typeof checked === 'boolean' && (
        <input type="checkbox" checked={checked} />
      )}
      <Avatar url={avatarUrl} color={itemColor} title={title} />
      <div className="list-item__info">
        <div className="list-item__row">
          <p className="list-item__title">{title}</p>
          <p className="list-item__title-right">{titleRight}</p>
        </div>
        <div className="list-item__row">
          <p className="list-item__subtitle">{subtitle}</p>
          <p className="list-item__subtitle-right">{subtitleRight}</p>
        </div>
      </div>
    </div>
  )
}
