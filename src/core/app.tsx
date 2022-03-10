import React, { FC } from 'react'
import Router from './router'
import ErrorBoundary from '../components/hocs/error-boundary'
import { MediaStateProvider, NavStateProvider } from '@reapit/elements'
import '@reapit/elements/dist/index.css'
import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
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
    </QueryClientProvider>
  </ErrorBoundary>
)

export default App
