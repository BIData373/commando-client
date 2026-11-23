import styled from "@emotion/styled"
import type { ReactNode } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

interface ContentLoaderProps {
	isLoading?: boolean
	children: ReactNode
	fallback?: ReactNode
}

export function ContentLoader({ isLoading, children, fallback }: ContentLoaderProps) {
	return isLoading ?
		<>
			{fallback ?? (
				<FallbackWrapper>
					<Skeleton count={7} />
				</FallbackWrapper>
			)}
		</>
		: <>{children}</>
}

const FallbackWrapper = styled.div`
  padding: 24px;
  width: 100%;
`
