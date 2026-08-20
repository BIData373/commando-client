import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { Loader2 } from "lucide-react"

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const SpinIcon = styled(Loader2)`
  flex-shrink: 0;
  animation: ${spin} 0.8s linear infinite;
`
