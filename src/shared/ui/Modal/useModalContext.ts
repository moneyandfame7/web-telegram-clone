import {useContext} from 'react'
import {ModalContext} from './context'

export function useModalContext() {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('Cannot use ModalContext outside the «ModalProvider»')
  }

  return context
}
