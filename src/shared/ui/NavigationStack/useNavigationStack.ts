import {createContext, type ReactNode, type RefObject, useContext} from 'react'

export interface NavigationItem {
  id: number
  component: ReactNode
  ref: RefObject<HTMLDivElement>
}
export interface PopItemOptions {
  toRoot: boolean
}
export interface PushItemParams {
  screen: ReactNode
  header?: ReactNode
  title?: string
  toolbar?: ReactNode
}
export interface NavigationStackStore {
  push: (item: NavigationItem['component']) => void
  pop: (options?: PopItemOptions) => void
  currentScreen: NavigationItem
  stack: NavigationItem[]
  direction: 'forward' | 'backward'
}

export const NavigationContext = createContext<
  NavigationStackStore | undefined
>(undefined)

// Хук для використання контексту навігації
export const useNavigationStack = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error(
      'useNavigationStack must be used within a NavigationProvider'
    )
  }
  return context
}
