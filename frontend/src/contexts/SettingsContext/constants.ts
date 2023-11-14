import { BallVelocityIncreaseModes, BallVelocityIncreaseModesKeys } from '.'

export const PADDLE_DEFAULT_SIZE = 10
export const BARRIER_DEFAULT_SIZE = 10

export const ballVelocityIncreaseModes: BallVelocityIncreaseModes = {
  slow: 0.000001,
  medium: 0.000005,
  fast: 0.00001,
}

export const ballVelocityIncreaseModesKeys: BallVelocityIncreaseModesKeys = {
  SLOW: 'slow',
  MEDIUM: 'medium',
  FAST: 'fast',
}


