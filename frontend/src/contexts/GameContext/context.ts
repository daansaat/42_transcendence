import { createContext, useContext } from 'react'
import { GameContextData } from '.'

export const GameContext = createContext({} as GameContextData)

export const useGame = () => useContext(GameContext)
