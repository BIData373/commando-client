import styled from "@emotion/styled"

export const ContentScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-inline: 24px;
  direction: ltr;

  & > * {
    direction: rtl;
  }
`
