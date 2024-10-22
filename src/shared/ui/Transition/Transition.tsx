// part of code from https://github.com/Ajaxy/telegram-tt/blob/master/src/components/ui/Transition.tsx

import {
  cloneElement,
  type ReactNode,
  useRef,
  useCallback,
  forwardRef,
} from 'react'
import {usePrevious} from '../../hooks/usePrevious'
import CSSTransition from 'react-transition-group/CSSTransition'
import {TransitionGroup} from 'react-transition-group'
import clsx from 'clsx'

import type {SingleTransitionProps, TransitionProps} from './types'
import {
  buildProperties,
  getTransitionTimeout,
  TRANSITION_CLASSES,
} from './helpers'

import './Transition.scss'

export const Transition = <TKey extends number>({
  children,
  activeKey,
  transitionName,
  timeout,
  direction = 'auto',
  shouldCleanup,
  cleanupException,
}: TransitionProps<TKey>) => {
  const prevActiveKey = usePrevious<any>(activeKey)
  const elementsRef = useRef<Record<number, ReactNode>>({})

  elementsRef.current[activeKey] = children
  const elementsKeys = Object.keys(elementsRef.current).map((k) => Number(k))

  const isBackwards =
    direction === -1 ||
    (direction === 'auto' && prevActiveKey > activeKey) ||
    (direction === 'inverse' && prevActiveKey < activeKey)
  const isLayout =
    transitionName === 'zoomSlide' || transitionName === 'slideDark'

  const cleanup = useCallback(() => {
    if (!shouldCleanup) {
      return
    }
    const preservedRender =
      cleanupException !== undefined
        ? elementsRef.current[cleanupException]
        : undefined

    elementsRef.current = preservedRender
      ? {[cleanupException!]: preservedRender}
      : {}

    // const preservedRender: Record<number, ReactNode> = {}
    // cleanupException.forEach((key) => {
    //   if (elementsRef.current[key] !== undefined) {
    //     preservedRender[key] = elementsRef.current[key]
    //   }
    // })

    // elementsRef.current = Object.keys(preservedRender).length
    //   ? preservedRender
    //   : {}
  }, [shouldCleanup, cleanupException])

  const elements = elementsKeys.map((key) => {
    const element = elementsRef.current[key]

    return (
      <SingleTransition
        unmount={false}
        key={key}
        timeout={timeout}
        transitionClassnames={TRANSITION_CLASSES}
        transitionName="zoomFade"
        in={false}
      >
        {element}
      </SingleTransition>
    )
  })

  const containerClassname = clsx(
    'transition',
    `transition-${transitionName}${isBackwards ? 'Backwards' : ''}`,
    {
      transition_layout: isLayout,
    }
  )
  return (
    <TransitionGroup
      className={containerClassname}
      childFactory={(c) => {
        return cloneElement(c, {
          in: c.key === `.$${activeKey}`,
          unmount:
            cleanupException !== undefined
              ? c.key !== `.$${cleanupException}`
              : shouldCleanup,
          onExited: () => {
            cleanup()
          },
        })
      }}
    >
      {elements}
    </TransitionGroup>
  )
}

export const SingleTransition = forwardRef<
  HTMLDivElement,
  SingleTransitionProps
>(
  (
    {
      transitionName,
      animationToggle,
      transitionClassnames,
      className,
      unmount,
      in: inAnimation,
      key,
      timeout,
      styles,
      direction,
      easing,
      appear,
      shouldLockUI,
      children,
      onClick,
      onExited,
    },
    ref
  ) => {
    const {classNames, styles: buildedStyles} = buildProperties(
      transitionName,
      styles,
      timeout,
      direction,
      animationToggle,
      inAnimation,
      easing
    )

    const buildedClassname = clsx(className, 'transition-item', {
      'transition-item_ui-lock': shouldLockUI,
    })
    return (
      <CSSTransition
        nodeRef={ref}
        key={key}
        in={inAnimation}
        appear={appear}
        mountOnEnter
        unmountOnExit={unmount}
        timeout={getTransitionTimeout(transitionName, timeout)}
        classNames={transitionClassnames || classNames}
        onExited={onExited}
      >
        <div
          onClick={onClick}
          className={buildedClassname}
          style={buildedStyles}
          ref={ref}
        >
          {children}
        </div>
      </CSSTransition>
    )
  }
)
