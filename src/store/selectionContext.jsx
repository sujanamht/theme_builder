import { createContext, useContext } from 'react'

export const SelectionContext = createContext(null)

export function useSelection() {
  return useContext(SelectionContext)
}
