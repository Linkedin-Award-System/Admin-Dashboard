import { useContext } from 'react';
import { ToastContext } from './use-toast-context';
import type { ToastContextValue } from './use-toast-types';

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
