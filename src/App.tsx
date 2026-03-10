import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 300000, // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            LinkedIn Creative Awards Ethiopia
          </h1>
          <p className="text-muted-foreground">
            Admin Dashboard - Project setup complete
          </p>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
