import styled from "@emotion/styled"

export const DashboardTableCard = styled.div<{ $rightBorder?: boolean }>`
  [data-slot="table"] {
    width: 100%;
    table-layout: fixed;
    min-width: 0 !important;
  }

  [data-slot="table-row"] {
    border-bottom: none;
    height: 44px;
  }

  [data-slot="table-cell"] {
    height: 44px;
    padding-block: 0;
    vertical-align: middle;
    overflow: hidden;
    border-right: 1px solid var(--primary-foreground);
    border-bottom: 1px solid var(--primary-foreground);
  }

  [data-slot="table-body"] [data-slot="table-row"]:last-child [data-slot="table-cell"] {
    border-bottom: none;
  }
`
