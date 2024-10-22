import {type ReactElement, type FC, type PropsWithChildren} from 'react'
import {useBoolean} from '../../hooks/useBoolean'
import {Menu} from '../Menu/Menu'

import './DropdownMenu.scss'
interface DropdownMenuProps extends PropsWithChildren {
  button: ReactElement
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  autoClose?: boolean
}
export const DropdownMenu: FC<DropdownMenuProps> = ({
  button,
  position = 'bottom-left',
  autoClose = true,
  children,
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
        isOpen={isMenuOpen}
        onClose={handleClose}
        autoClose={autoClose}
      >
        {children}
      </Menu>
    </div>
  )
}
