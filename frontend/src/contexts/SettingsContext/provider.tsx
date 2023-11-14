import { useState } from 'react'
import { ballVelocityIncreaseModesKeys, Settings, SettingsContext, SettingsProviderProps, PADDLE_DEFAULT_SIZE, BARRIER_DEFAULT_SIZE } from '.'



export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>({
    ballVelocityIncrease: ballVelocityIncreaseModesKeys.MEDIUM,
    paddleSize: PADDLE_DEFAULT_SIZE,
    barrierSize: BARRIER_DEFAULT_SIZE,

  })

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
