import type {FC, PropsWithChildren} from 'react'
import {useModalContext} from './useModalContext'
import {IconButton} from '../IconButton/IconButton'

export const ModalTitle: FC<PropsWithChildren> = ({children}) => {
  const context = useModalContext()

  return (
    <h5 className="modal-title">
      {context.hasCloseButton && (
        <IconButton onClick={context.onClose} name="close" title="Close" />
      )}
      {children}
    </h5>
  )
}
