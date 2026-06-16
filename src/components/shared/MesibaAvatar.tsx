import styled from "@emotion/styled"
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar"

export const MesibaAvatarRoot = styled(Avatar)`
  &:has(img) {
    border: 0;

    &::after {
      border: none;
    }
  }
`

export const MesibaAvatarImage = styled(AvatarImage)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0;
`

export const MesibaAvatarFallback = styled(AvatarFallback)``
