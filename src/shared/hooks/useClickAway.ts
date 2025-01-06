import {RefObject} from 'react'
import {useEventListener} from './useEventListener'

type ClickAwayHandler = (e: MouseEvent, el: HTMLElement) => void
export const useClickAway = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: ClickAwayHandler,
  disabled = false
) => {
  useEventListener('mousedown', (event) => {
    if (disabled) {
      return
    }
    const el = ref?.current
    const clicked = event.target as HTMLElement
    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(clicked)) {
      return
    }

    handler(event, clicked)
  })
}
