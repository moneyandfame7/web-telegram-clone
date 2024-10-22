import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  type FC,
} from 'react'
import {ModalProvider} from './context'
import {Portal} from '../Portal'
import {SingleTransition} from '../Transition/Transition'

import {IconButton} from '../IconButton/IconButton'

import './Modal.scss'

interface ModalProps {
  isOpen: boolean
  onClose: VoidFunction
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  hasCloseButton?: boolean
  onExitTransition?: VoidFunction
  className?: string

  title?: string
  header?: ReactNode
  content?: ReactNode
  actions?: ReactNode
}
export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  closeOnBackdrop = true,
  closeOnEsc = true,
  hasCloseButton = true,
  onExitTransition,
  className,

  title,
  header,
  content,
  actions,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('has-open-popup')
    } else {
      document.documentElement.classList.remove('has-open-popup')
    }
  }, [isOpen])
  const modalRef = useRef<HTMLDivElement>(null)

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdrop && !modalRef.current?.contains(e.target as Node)) {
        onClose()
      }
    },
    [closeOnBackdrop]
  )

  const buildedClass = ['modal-container', className].filter(Boolean).join(' ')

  return (
    <ModalProvider value={{isOpen, hasCloseButton, onClose}}>
      <Portal>
        <SingleTransition
          className="modal"
          appear
          transitionName="fade"
          in={isOpen}
          unmount={true}
          timeout={200}
          onExited={onExitTransition}
          onClick={handleBackdropClick}
        >
          <div className={buildedClass} ref={modalRef}>
            <div className="modal-header">
              {hasCloseButton && (
                <IconButton
                  title="Close Modal"
                  onClick={onClose}
                  name="close"
                  color="secondary"
                />
              )}
              {title && <p className="modal-title">{title}</p>}
              {header}
            </div>

            <div className="modal-content">{content}</div>

            <div className="modal-actions">{actions}</div>
          </div>
        </SingleTransition>
      </Portal>
    </ModalProvider>
  )
}
