import type {FC} from 'react'
import {MenuContext, type MenuProviderProps} from './context/useMenuContext'

export const MenuProvider: FC<MenuProviderProps> = ({props, children}) => {
  return <MenuContext.Provider value={props}>{children}</MenuContext.Provider>
}
