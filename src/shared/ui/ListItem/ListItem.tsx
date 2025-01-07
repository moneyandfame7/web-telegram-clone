import {MouseEvent, ReactNode, useRef, type FC} from 'react'
import {Avatar} from '../Avatar/Avatar'

import {ChatColor} from '../../../app/types'

import clsx from 'clsx'

import './ListItem.scss'
import {IconName} from '../Icon/Icon'
import {useContextMenu} from '../../hooks/useContextMenu'
import {Menu} from '../Menu/Menu'
import {MenuItem} from '../Menu/MenuItem'

export type MenuContextActions =
  | {
      handler: (e: MouseEvent) => void | Promise<void>
      title: string
      icon?: IconName
      danger?: boolean
    }
  | {isSeparator: true}

interface ListItemProps {
  title: string
  titleRight?: ReactNode
  subtitle?: ReactNode
  subtitleRight?: ReactNode
  onClick: (e: MouseEvent<HTMLDivElement>) => void
  contextActions?: MenuContextActions[]
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
  contextActions,
  avatarUrl,
  itemColor,
  checked,
  selected,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const {isContextMenuOpen, handleContextMenu, handleContextMenuClose, styles} =
    useContextMenu({
      menuRef,
      triggerRef: ref,
      getMenuElement: () => {
        return document
          .querySelector('#portal')
          ?.querySelector('.list-item__context-menu') as HTMLDivElement | null
      },
    })

  const className = clsx('list-item', {
    'list-item--selected': selected,
    'list-item--menu-open': isContextMenuOpen,
  })
  return (
    <div className="list-item-container">
      <div
        ref={ref}
        className={className}
        onClick={onClick}
        onContextMenu={handleContextMenu}
      >
        {typeof checked === 'boolean' && (
          <input type="checkbox" checked={checked} />
        )}
        <Avatar url={avatarUrl} color={itemColor} title={title} />
        <div className="list-item__info">
          <div className="list-item__row">
            <p className="list-item__title">{title}</p>
            <div className="list-item__title-right">{titleRight}</div>
          </div>
          <div className="list-item__row">
            <div className="list-item__subtitle">{subtitle}</div>
            <div className="list-item__subtitle-right">{subtitleRight}</div>
          </div>
        </div>
      </div>
      {contextActions && (
        <Menu
          unmount
          className="list-item__context-menu"
          elRef={menuRef}
          isOpen={isContextMenuOpen}
          handleAwayClick={true}
          onClose={handleContextMenuClose}
          style={styles}
          portal
          backdrop
        >
          {contextActions?.map((action, idx) => {
            if ('isSeparator' in action) {
              return <div key={idx} className="menu__separator" />
            } else {
              return (
                <MenuItem
                  title={action.title}
                  danger={action.danger}
                  key={action.title}
                  onClick={action.handler}
                  icon={action.icon}
                />
              )
            }
          })}
        </Menu>
      )}
    </div>
  )
}
