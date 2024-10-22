import {createContext, type PropsWithChildren, useContext} from 'react'

interface MenuContextType {
  onClose: () => void
  isOpen: boolean
  autoClose: boolean
}
export interface MenuProviderProps extends PropsWithChildren {
  props: MenuContextType
}

export const MenuContext = createContext<MenuContextType | null>(null)

export function useMenuContext() {
  const context = useContext(MenuContext)

  if (!context) {
    throw new Error('Cannot use «MenuContext» outside the «MenuProvider»')
  }

  return context
}
