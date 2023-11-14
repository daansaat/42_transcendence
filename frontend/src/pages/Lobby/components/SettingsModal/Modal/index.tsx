import { ReactNode } from 'react'
import { CloseIcon } from '../../../assets'
import './styles.css'
import { Button } from '../Button'

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Modal({ children, isOpen, setIsOpen }: ModalProps) {
  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
    >
      <div onClick={(e) => e.stopPropagation()} className='modal-content'>
        <Button
          icon={<CloseIcon style={{ position: 'absolute', top: -180, right: -180 }} />}
          className='close-button'
          style={{ position: 'relative' }}
          onClick={() => setIsOpen(false)}
        />

        {children}
      </div>
    </div>
  )
}
