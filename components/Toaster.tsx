'use client';

import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
const listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast: Toast = { id: String(++toastId), message, type };
  toasts = [...toasts, toast];
  listeners.forEach((listener) => listener(toasts));
  
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== toast.id);
    listeners.forEach((listener) => listener(toasts));
  }, 3000);
};

export const Toaster = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts([...newToasts]);
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast animate-slide-up flex items-center space-x-3 ${
            toast.type === 'success' ? 'border-green-500/50' : ''
          } ${toast.type === 'error' ? 'border-red-500/50' : ''} ${
            toast.type === 'info' ? 'border-blue-500/50' : ''
          }`}
        >
          {toast.type === 'success' && (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === 'error' && (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.type === 'info' && (
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-white text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
