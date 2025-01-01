import { createRoot } from 'react-dom/client';
import './index.css';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, DataProvider, ThemeProvider, Toaster } from '@/contexts';
import { AppRouter } from '@/routes';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();
const helmetContext = {};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider context={helmetContext}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <DataProvider>
              <AppRouter />
            </DataProvider>
          </ThemeProvider>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
