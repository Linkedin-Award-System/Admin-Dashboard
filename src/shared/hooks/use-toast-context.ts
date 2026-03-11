import { createContext } from 'react';
import type { ToastContextValue } from './use-toast-types';

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
