import {createContext, type FC, type PropsWithChildren} from 'react'

interface IModalContext {
  onClose: () => void
  isOpen: boolean
  hasCloseButton: boolean
}
interface ModalProviderProps extends PropsWithChildren {
  value: IModalContext
}

export const ModalContext = createContext<IModalContext | null>(null)

export const ModalProvider: FC<ModalProviderProps> = ({children, value}) => {
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
