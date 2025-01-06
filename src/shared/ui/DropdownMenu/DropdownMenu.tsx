import {
  type ReactElement,
  type FC,
  type PropsWithChildren,
  CSSProperties,
} from 'react'
import {useBoolean} from '../../hooks/useBoolean'
import {Menu, MenuPosition, MenuTransform} from '../Menu/Menu'

import './DropdownMenu.scss'
interface DropdownMenuProps extends PropsWithChildren {
  button: ReactElement
  position?: MenuPosition
  transform?: MenuTransform
  autoClose?: boolean
  style?: CSSProperties
}
export const DropdownMenu: FC<DropdownMenuProps> = ({
  button,
  position = 'bottom-left',
  transform,
  autoClose = true,
  children,
  style,
}) => {
  const {value: isMenuOpen, setFalse: closeMenu, toggle} = useBoolean(false)

  const handleClose = () => {
    closeMenu()
  }

  return (
    <div className="dropdown-menu" onClick={toggle}>
      {button}
      <Menu
        position={position}
        transform={transform}
        isOpen={isMenuOpen}
        onClose={handleClose}
        autoClose={autoClose}
        style={style}
      >
        {children}
      </Menu>
    </div>
  )
}
