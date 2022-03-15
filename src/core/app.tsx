import React, { FC } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import Router from './router'
import ErrorBoundary from '../components/hocs/error-boundary'
import { MediaStateProvider, NavStateProvider } from '@reapit/elements'
import '@reapit/elements/dist/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
})

const App: FC = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <NavStateProvider>
        <MediaStateProvider>
          <Router />
        </MediaStateProvider>
      </NavStateProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </ErrorBoundary>
)

export default App
