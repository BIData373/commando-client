import { createContext, useContext, useState, useLayoutEffect, type ReactNode } from 'react'

interface TitleBarContextValue {
  actions: ReactNode | null
  setActions: (actions: ReactNode | null) => void
}

const TitleBarContext = createContext<TitleBarContextValue>({
  actions: null,
  setActions: () => {},
})

interface TitleBarProviderProps {
  children: ReactNode
}

export function TitleBarProvider({ children }: TitleBarProviderProps) {
  const [actions, setActions] = useState<ReactNode | null>(null)

  return (
    <TitleBarContext.Provider value={{ actions, setActions }}>
      {children}
    </TitleBarContext.Provider>
  )
}

export function useTitleBarActions() {
  return useContext(TitleBarContext)
}

export function useTitleBar(renderActions: () => ReactNode, deps: unknown[]) {
  const { setActions } = useTitleBarActions()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setActions(renderActions())
    return () => setActions(null)
  }, [setActions, ...deps])
}
