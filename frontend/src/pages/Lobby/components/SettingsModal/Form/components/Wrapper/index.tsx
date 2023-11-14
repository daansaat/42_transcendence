import { FormEvent, ReactNode } from 'react'

export type FormProps = {
  handleSubmit?: () => void
  children: ReactNode
}

export function Wrapper({ handleSubmit, children }: FormProps) {
  function onSubmit(e: FormEvent) {
    e.preventDefault()
    handleSubmit?.()
  }

  return (
    <form onSubmit={onSubmit} className='form'>
      {children}
    </form>
  )
}
