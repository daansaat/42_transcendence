import { useSettings } from '../../../../contexts'
import './styles.css'

export type PaddleProps = {
  paddleRef: React.RefObject<HTMLDivElement>
  side?: 'left' | 'right'
}

export function Paddle({ paddleRef, side = 'left' }: PaddleProps) {
  const { settings } = useSettings()

  return (
    <div
      ref={paddleRef}
      className={`paddle ${side}`}
      style={{ height: `${settings.paddleSize}vh` }}
    />
  )
}
