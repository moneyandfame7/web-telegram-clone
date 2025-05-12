import {ChangeEvent, MouseEvent, ReactNode, useRef, type FC} from 'react'
import {Avatar} from '../Avatar/Avatar'

import {ChatColor} from '../../../app/types'

import clsx from 'clsx'

import {Icon, IconName} from '../Icon/Icon'
import {useContextMenu} from '../../hooks/useContextMenu'
import {Menu} from '../Menu/Menu'
import {MenuItem} from '../Menu/MenuItem'
import {Size} from '../../types/ui-types'

import './ListItem.scss'

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
  startContent?: ReactNode
  titleRight?: ReactNode
  subtitle?: ReactNode
  subtitleRight?: ReactNode
  onClick: (e: MouseEvent<HTMLDivElement>) => void
  onToggle?: (e: ChangeEvent<HTMLInputElement>) => void
  contextActions?: MenuContextActions[]
  avatarUrl?: string
  avatarSize?: Size
  itemColor?: ChatColor
  className?: string
  withAvatar?: boolean
  checked?: boolean
  selected?: boolean
  danger?: boolean
  disabled?: boolean
  variant?: 'default' | 'secondary'
}
export const ListItem: FC<ListItemProps> = ({
  title,
  startContent,
  titleRight,
  subtitle,
  subtitleRight,
  onClick,
  onToggle,
  contextActions,
  avatarUrl,
  avatarSize,
  itemColor,
  className,
  withAvatar = true,
  checked,
  selected,
  danger,
  disabled,
  variant = 'default',
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

  const buildedClassname = clsx('list-item', className, {
    'list-item--selected': selected,
    'list-item--menu-open': isContextMenuOpen,
    'list-item--clickable': Boolean(onClick),
    'list-item--danger': danger,
    'list-item--disabled': disabled,
    'list-item--secondary': variant === 'secondary',
  })

  return (
    <>
      <div
        ref={ref}
        className={buildedClassname}
        onClick={disabled ? undefined : onClick}
        onContextMenu={contextActions && handleContextMenu}
      >
        {typeof checked === 'boolean' && (
          <label className="list-item__checkbox">
            <input type="checkbox" checked={checked} />
            <Icon title="Check" name="check" color="white" size="small" />
          </label>
        )}
        {startContent}
        {withAvatar && (
          <Avatar
            url={avatarUrl}
            color={itemColor}
            title={title}
            size={avatarSize}
          />
        )}
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
    </>
  )
}
