import { ReactNode } from 'react'

export type BallVelocityIncreaseModeKey = 'slow' | 'medium' | 'fast'

export type BallVelocityIncreaseModesKeys = {
  SLOW: 'slow'
  MEDIUM: 'medium'
  FAST: 'fast'
}

export type BallVelocityIncreaseModes = {
  slow: number
  medium: number
  fast: number
}

export type Settings = {
  ballVelocityIncrease: BallVelocityIncreaseModeKey
  paddleSize: number
  barrierSize: number
}

export type SettingsContextData = {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export type SettingsProviderProps = {
  children: ReactNode
}
