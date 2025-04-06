import {
  type FC,
  memo,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
} from 'react'
import {Icon, type IconName} from '../Icon/Icon'
import {useMenuContext} from './context/useMenuContext'

interface MenuItemProps extends PropsWithChildren {
  title: string
  icon?: IconName
  badge?: ReactNode
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void | Promise<void>
  danger?: boolean
  closeOnClick?: boolean
}

export const MenuItem: FC<MenuItemProps> = memo(
  ({title, icon, badge, danger, onClick, closeOnClick = true}) => {
    const {onClose, autoClose} = useMenuContext()

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        onClick?.(e)
        if (!closeOnClick) {
          return
        }
        if (autoClose) {
          onClose()
        }
      },
      [onClick, autoClose, onClose]
    )

    const className = `menu__item${danger ? ' danger' : ''}`
    return (
      <div className={className} onClick={handleClick}>
        {icon && (
          <Icon size="small" title={title} color="default" name={icon} />
        )}
        <span className="menu__title">{title}</span>
        {badge && <span className="menu__badge">{badge}</span>}
      </div>
    )
  }
)

export const MenuSeparator: FC = () => {
  return <hr className="menu__separator" />
}
