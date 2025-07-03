"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: AlertCircle
  };

  const colors = {
    success: 'bg-green-900 border-green-700 text-green-100',
    error: 'bg-red-900 border-red-700 text-red-100',
    warning: 'bg-yellow-900 border-yellow-700 text-yellow-100',
    info: 'bg-blue-900 border-blue-700 text-blue-100'
  };

  const Icon = icons[toast.type] || AlertCircle;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`flex items-center p-4 rounded-lg border shadow-lg ${colors[toast.type]} min-w-[300px] max-w-[500px]`}
    >
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        {toast.title && (
          <div className="font-semibold mb-1">{toast.title}</div>
        )}
        <div className="text-sm opacity-90">{toast.message}</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(toast.id)}
        className="ml-2 h-6 w-6 p-0 opacity-70 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

let toastId = 0;

class ToastManager {
  constructor() {
    this.toasts = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  add(toast) {
    const id = ++toastId;
    const newToast = { id, ...toast };
    this.toasts.push(newToast);
    this.notify();
    return id;
  }

  remove(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  success(message, title = 'Success') {
    return this.add({ type: 'success', title, message });
  }

  error(message, title = 'Error') {
    return this.add({ type: 'error', title, message });
  }

  warning(message, title = 'Warning') {
    return this.add({ type: 'warning', title, message });
  }

  info(message, title = 'Info') {
    return this.add({ type: 'info', title, message });
  }
}

const toastManager = new ToastManager();

export const toast = {
  success: (message, title) => toastManager.success(message, title),
  error: (message, title) => toastManager.error(message, title),
  warning: (message, title) => toastManager.warning(message, title),
  info: (message, title) => toastManager.info(message, title),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={(id) => toastManager.remove(id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
