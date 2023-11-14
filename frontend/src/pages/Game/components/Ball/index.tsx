import { RefObject } from 'react'
import './styles.css'

type BallProps = {
  ballRef: RefObject<HTMLDivElement>
}

export function Ball({ ballRef }: BallProps) {
  return <div ref={ballRef} id='ball' className='ball' />
}

