import React, {
  CSSProperties,
  MouseEventHandler,
  RefObject,
  type PropsWithChildren,
} from 'react'
import {CSSTransitionClassNames} from 'react-transition-group/CSSTransition'

export type TransitionName =
  | 'slide'
  | 'slideY'
  | 'slideFade'
  | 'slideFadeY'
  | 'zoomSlide'
  | 'zoomFade'
  | 'fade'
  | 'slideDark'
  | 'rotate'
  | 'rotate3d'
  | 'zoomIcon'
  | 'collapseY'

export type TransitionDirection = 'auto' | 'inverse' | 1 | -1
export type TransitionEasing =
  | 'ease'
  | 'ease-in'
  | 'ease-in-out'
  | 'ease-out'
  | 'linear'

export interface TransitionProps<TKey extends number>
  extends PropsWithChildren {
  activeKey: TKey
  transitionName: TransitionName
  timeout?: number
  direction?: TransitionDirection
  shouldCleanup?: boolean
  cleanupException?: TKey
}
export interface SingleTransitionProps extends PropsWithChildren {
  transitionName: TransitionName
  easing?: TransitionEasing
  direction?: TransitionDirection

  transitionClassnames?: CSSTransitionClassNames
  className?: string
  /**
   * Should remove from DOM?
   */
  unmount?: boolean
  animationToggle?: boolean
  appear?: boolean
  in: boolean

  /** while animated - ui is disabled */
  shouldLockUI?: boolean

  timeout?: number

  key?: number
  styles?: CSSProperties
  // ref?: RefObject<HTMLDivElement>
  onClick?: MouseEventHandler<HTMLDivElement>
  onExited?: (node?: Element) => void
}
