import { createRouter } from '@tanstack/react-router'
import { queryClient } from './queryClient'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

export interface HeaderConfig {
  title?: string
  user?: boolean
  navigation?: boolean
  workspace?: boolean
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }

  interface StaticDataRouteOption {
    header?: HeaderConfig
  }
}

export default router 