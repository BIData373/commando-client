import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,

  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

export interface HeaderConfig {
  title?: React.ReactNode
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