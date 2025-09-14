import type { FC, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      {/* Add more providers here if needed */}
      {children}
    </BrowserRouter>
  );
};

export default AppProviders;
