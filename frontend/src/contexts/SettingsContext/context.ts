import { createContext, useContext } from 'react'
import { SettingsContextData } from '.'

export const SettingsContext = createContext({} as SettingsContextData)

export const useSettings = () => useContext(SettingsContext)
