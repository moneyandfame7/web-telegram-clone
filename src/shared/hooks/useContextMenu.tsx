import {
  CSSProperties,
  RefObject,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react'
import {useBoolean} from './useBoolean'
import {MenuTransform} from '../ui/Menu/Menu'

interface UseContextMenuParams {
  menuRef: RefObject<HTMLDivElement>
  triggerRef: RefObject<HTMLDivElement>
  getMenuElement: () => HTMLDivElement | null
  disabled?: boolean
}
export const useContextMenu = ({
  menuRef,
  triggerRef,
  getMenuElement,
  disabled,
}: UseContextMenuParams) => {
  const {value, setFalse, setTrue} = useBoolean(false)
  const [position, setPosition] = useState<{x: number; y: number} | undefined>(
    undefined
  )
  const [styles, setStyles] = useState<CSSProperties>()

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      return
    }
    const menuEl = getMenuElement()

    if (position || menuRef.current || menuEl) {
      setPosition(undefined)
      setFalse()
    } else {
      e.preventDefault()
      setTrue()

      setPosition({x: e.clientX, y: e.clientY})
    }
  }

  const handleContextMenuClose = useCallback(() => {
    setFalse()
    setPosition(undefined)
  }, [])

  useLayoutEffect(() => {
    if (disabled) {
      return
    }

    const menuEl = menuRef.current

    const triggerRect = triggerRef.current?.getBoundingClientRect()
    const menuWidth = menuEl?.offsetWidth
    const menuHeight = menuEl?.offsetHeight

    if (!position || !menuEl || !menuWidth || !menuHeight || !triggerRect) {
      return
    }
    let {x, y} = position

    let transformOrigin: MenuTransform = 'top left'

    console.log({x, y})

    const notInContainerX = x > window.innerWidth - menuWidth
    const notInContainerY = y > window.innerHeight - menuHeight

    if (notInContainerX) {
      x = window.innerWidth - menuWidth - 10
    }
    if (notInContainerY) {
      y = window.innerHeight - menuHeight - 10
    }

    const isLeft = x < window.innerWidth / 2
    const isTop = y < window.innerHeight / 2

    if (isTop) {
      transformOrigin = isLeft ? 'top left' : 'top right'
    } else {
      transformOrigin = isLeft ? 'bottom left' : 'bottom right'
    }

    console.log({isLeft})

    setStyles({
      left: x,
      top: y,
      transformOrigin: transformOrigin,
      /* dynamicTransformOrigin ? transformOrigin :  */
    })
  }, [disabled, position])

  return {
    handleContextMenu,
    handleContextMenuClose,
    isContextMenuOpen: value,
    styles,
  }
}
