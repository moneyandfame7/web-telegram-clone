/* eslint-disable react/prop-types */
import {
  CSSProperties,
  type FC,
  memo,
  MouseEvent,
  type PropsWithChildren,
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react'
import clsx from 'clsx'

import {MenuProvider} from './MenuProvider'

import {SingleTransition} from '../Transition/Transition'
import {Portal} from '../Portal'

import './Menu.scss'

export type MenuPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
export type MenuTransform =
  | 'bottom left'
  | 'bottom right'
  | 'default'
  | 'top right'
  | 'top left'
  | 'top center'
  | 'top'
  | 'center'
  | 'bottom'
interface MenuProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  autoClose?: boolean
  position?: MenuPosition
  transform?: MenuTransform
  className?: string
  elRef?: RefObject<HTMLDivElement>
  unmount?: boolean
  backdrop?: boolean
  portal?: boolean
  handleAwayClick?: boolean
  style?: CSSProperties
}

const MENU_MARGIN_PX = 8

// eslint-disable-next-line react/display-name
export const Menu: FC<MenuProps> = memo(
  ({
    isOpen,
    onClose,
    autoClose = true,
    position = 'bottom-left',
    transform,
    children,
    className,
    unmount,
    elRef,
    handleAwayClick,
    backdrop = true,
    portal,
    style,
  }) => {
    let menuRef = useRef<HTMLDivElement>(null)

    if (elRef) {
      menuRef = elRef
    }

    const handleClickBackdrop = useCallback((e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      // e.stopImmediatePropagation()

      // stopEvent(e)
      onClose()
    }, [])

    useLayoutEffect(() => {
      const menuEl = menuRef.current
      const parent = menuEl?.parentElement

      if (!menuEl || !parent || !isOpen) {
        return
      }

      const rect = menuEl.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top < 0) {
        menuEl.style.top = `${MENU_MARGIN_PX}px`
      }

      if (rect.bottom > windowHeight) {
        menuEl.style.top = `-${rect.height + MENU_MARGIN_PX}px`
      }
    }, [isOpen])

    // useClickAway(
    //   menuRef,
    //   (e, clicked) => {
    //     if (isOpen && (backdrop ? clicked.className !== 'backdrop' : true)) {
    //       e.preventDefault()
    //       // e.stopImmediatePropagation()
    //       // stopEvent(e)
    //       onClose()
    //     }
    //   },
    //   !handleAwayClick || !isOpen
    // )

    const buildedClass = clsx(className, 'menu', position)
    const menu = (
      <MenuProvider
        props={{
          onClose,
          isOpen,
          autoClose,
        }}
      >
        <SingleTransition
          transitionName="zoomFade"
          in={isOpen}
          ref={menuRef}
          className={buildedClass}
          timeout={150}
          styles={{transformOrigin: transform, ...style}}
          unmount={unmount}
        >
          {children}
        </SingleTransition>
        {isOpen && backdrop && (
          <div className="backdrop" onMouseDown={handleClickBackdrop} />
        )}
        {/* {isOpen && (
          <div ref={menuRef} className={buildedClass}>
          </div>
        )} */}
      </MenuProvider>
    )

    if (portal) {
      return <Portal>{menu}</Portal>
    }

    return menu
  }
)
