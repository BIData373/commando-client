import styled from "@emotion/styled"
import { NavigationMenuLink } from "../ui/navigation-menu"

export const HeaderNavTab = styled(NavigationMenuLink)`
  && {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 8px;
    border-radius: 0;
    font-size: var(--fs-btn);
    font-weight: 400;
    line-height: 20px;
    white-space: nowrap;
    text-decoration: none;
    background: transparent;
    cursor: pointer;

    &:hover {
      background: var(--header-button-hover);
    }
  }
`
