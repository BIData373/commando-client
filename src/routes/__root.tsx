import styled from '@emotion/styled'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import Header from '../components/Header'

import { StrictMode } from 'react'
import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <StrictMode>
      <AppShell>
        <Header />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </AppShell>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </StrictMode>
  )
}

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const PageContainer = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background: var(--primary-foreground);
  padding-inline: 32px;
`
