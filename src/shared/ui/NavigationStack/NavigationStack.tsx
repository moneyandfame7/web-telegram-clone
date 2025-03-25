import {
  type FC,
  useState,
  cloneElement,
  useCallback,
  createRef,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import {TransitionGroup} from 'react-transition-group'

import {SingleTransition} from '../Transition/Transition'

import './NavigationStack.scss'
import {
  type NavigationItem,
  NavigationContext,
  type PopItemOptions,
} from './useNavigationStack'

interface NavigationStackProps extends PropsWithChildren {
  initialScreen: ReactNode
  showHeader?: boolean
}

export const NavigationStack: FC<NavigationStackProps> = ({
  initialScreen,
  children,
}) => {
  const [stack, setStack] = useState<NavigationItem[]>([
    {
      id: 0,
      component: initialScreen,
      ref: createRef(),
    },
  ])
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  /**
   * @todo зробити для окремого екрану поле unmount?
   * переписати анімацію, використовувати лише один варіант? як в K версії ( затемнення )
   */
  const push = useCallback((item: NavigationItem['component']) => {
    setStack((prevStack) => {
      const id = prevStack[prevStack.length - 1].id + 1
      return [
        ...prevStack,
        {
          id,
          component: item,
          ref: createRef(),
        },
      ]
    })
    setDirection('forward')
  }, [])
  const pop = useCallback((options?: PopItemOptions) => {
    const {toRoot = false} = options ?? {}
    if (toRoot) {
      setStack((prev) => [prev[0]])
    } else {
      setStack((prevStack) =>
        prevStack.length === 1 ? prevStack : prevStack.slice(0, -1)
      )
    }
    setDirection('backward')
  }, [])

  const currentScreen = stack[stack.length - 1]

  const stackClassname = `navigation-stack navigation-stack-slideDark${
    direction === 'backward' ? 'Backwards' : ''
  }`

  const elements = stack.map((item) => {
    return (
      <SingleTransition
        ref={item.ref}
        key={item.id}
        transitionClassnames={{
          appearActive: 'navigation-item_to',
          appearDone: 'navigation-item_active',
          enterDone: 'navigation-item_active',
          enterActive: 'navigation-item_to',
          exitActive: 'navigation-item_from',
          exitDone: 'navigation-item_inactive',
        }}
        className="navigation-item"
        transitionName="slideDark"
        in={false}
      >
        {item.component}
      </SingleTransition>
    )
  })
  return (
    <NavigationContext.Provider
      value={{currentScreen, direction, pop, push, stack}}
    >
      {/* {currentScreen.header && (
        <header className="navigation-header">{currentScreen.header}</header>
      )} */}
      {/* <NavigationBar /> */}
      <TransitionGroup
        className={stackClassname}
        /**
         * потрібно використовувати childFactory, щоб оновити childs
         * https://reactcommunity.org/react-transition-group/transition-group#TransitionGroup-prop-childFactory
         */
        childFactory={(c) => {
          const fixedId = Number(c.key!.split('.$')[1])

          return cloneElement(c, {
            in: c.key === `.$${currentScreen.id}`,
            unmount: !stack.find((item) => item.id === fixedId),
          })
        }}
      >
        {elements}
      </TransitionGroup>
      {children}
    </NavigationContext.Provider>
  )
}
