import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"

interface ErrorModalContextValue {
	errorCode: number | null
	setErrorCode(errorCode: number | null): void
}

const ErrorModalContext = createContext<ErrorModalContextValue | null>(null)

interface ErrorModalProviderProps {
	children: ReactNode
}

export function ErrorModalProvider({ children }: ErrorModalProviderProps) {
	const [errorCode, setErrorCode] = useState<number | null>(null)

	return (
		<ErrorModalContext.Provider value={{ errorCode, setErrorCode }}>
			{children}
		</ErrorModalContext.Provider>
	)
}

export function useErrorModal() {
	const context = useContext(ErrorModalContext)
	if (!context) {
		throw new Error("useErrorModal must be used inside a ErrorModalProvider")
	}
	return context
}

export function useErrorHandler(...errors: (number | null | undefined)[]) {
	const { setErrorCode } = useErrorModal()

	const error = useMemo(() => errors.find(Boolean), [errors])

	useEffect(() => {
		if (error) {
			setErrorCode(error)
		}
	}, [error, setErrorCode])
}
