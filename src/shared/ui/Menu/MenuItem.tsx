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
}

export const MenuItem: FC<MenuItemProps> = memo(
  ({title, icon, badge, danger, onClick}) => {
    const {onClose, autoClose} = useMenuContext()

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        onClick?.(e)

        if (autoClose) {
          onClose()
        }
      },
      [onClick, autoClose, onClose]
    )
    return (
      <div className="menu__item" onClick={handleClick}>
        {icon && (
          <Icon size="small" title={title} color="default" name={icon} />
        )}
        <span className="menu__title">{title}</span>
        {badge && <span className="menu__badge">{badge}</span>}
      </div>
    )
  }
)
