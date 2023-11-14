import { SettingsIcon } from '../../assets'
import { Button } from './Button'
import { Modal } from './Modal'
import { SettingsForm } from './Form'

type ModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Settings({ isOpen, setIsOpen }: ModalProps) {
  return (
    <>
      <Button icon={<SettingsIcon />} onClick={() => setIsOpen(true)} />

      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <SettingsForm />
      </Modal>
    </>
  )
}
