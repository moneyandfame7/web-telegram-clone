import {
  type FC,
  memo,
  type PropsWithChildren,
  useLayoutEffect,
  useRef,
} from 'react'
import clsx from 'clsx'

import {MenuProvider} from './MenuProvider'

import './Menu.scss'

interface MenuProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  autoClose?: boolean
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

const MENU_MARGIN_PX: number = 8

export const Menu: FC<MenuProps> = memo(
  ({isOpen, onClose, autoClose = true, position = 'bottom-left', children}) => {
    const menuRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
      const menuEl = menuRef.current
      const parent = menuEl?.parentElement

      if (!menuEl || !parent || !isOpen) {
        return
      }

      const rect = menuEl.getBoundingClientRect()
      // const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      if (rect.top < 0) {
        menuEl.style.top = `${MENU_MARGIN_PX}px`
      }

      if (rect.bottom > windowHeight) {
        menuEl.style.top = `-${rect.height + MENU_MARGIN_PX}px`
      }

      // console.log(rect, window.innerWidth, window.innerHeight)
    }, [isOpen])

    const buildedClass = clsx('menu', position)
    return (
      <MenuProvider
        props={{
          onClose,
          isOpen,
          autoClose,
        }}
      >
        {isOpen && (
          <div ref={menuRef} className={buildedClass}>
            {children}
          </div>
        )}
      </MenuProvider>
    )
  }
)
