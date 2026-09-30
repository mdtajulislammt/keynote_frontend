import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Toaster } from 'sonner';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
