/**
 * Service Worker Hook - PWA Management
 * FASE 2.2 - Mobile-First Optimization
 */

import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  installing: boolean;
}

interface ServiceWorkerActions {
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  update: () => Promise<void>;
  skipWaiting: () => void;
}

export function useServiceWorker(): ServiceWorkerState & ServiceWorkerActions {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: typeof window !== 'undefined' ? navigator?.onLine ?? true : true,
    updateAvailable: false,
    installing: false,
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Check for service worker support
  useEffect(() => {
    if (typeof window === 'undefined') return

    setState(prev => ({
      ...prev,
      isSupported: 'serviceWorker' in navigator,
    }));
  }, []);

  // Listen for online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Service Worker registration
  const register = async (): Promise<void> => {
    if (!state.isSupported) {
      console.warn('[Atma PWA] Service Worker not supported');
      return;
    }

    try {
      setState(prev => ({ ...prev, installing: true }));

      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Always check for updates
      });

      setRegistration(reg);

      // Check for immediate updates
      if (reg.waiting) {
        setState(prev => ({ ...prev, updateAvailable: true }));
      }

      // Listen for new service worker
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, updateAvailable: true }));
            }
          });
        }
      });

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      setState(prev => ({
        ...prev,
        isRegistered: true,
        installing: false,
      }));

      console.log('[Atma PWA] Service Worker registered successfully');

      // Enable background sync for forms
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        await reg.sync.register('atma-form-sync');
        console.log('[Atma PWA] Background sync registered');
      }

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        console.log('[Atma PWA] Notification permission:', permission);
      }

    } catch (error) {
      console.error('[Atma PWA] Service Worker registration failed:', error);
      setState(prev => ({ ...prev, installing: false }));
    }
  };

  // Service Worker unregistration
  const unregister = async (): Promise<void> => {
    if (!registration) return;

    try {
      await registration.unregister();
      setRegistration(null);
      setState(prev => ({ ...prev, isRegistered: false }));
      console.log('[Atma PWA] Service Worker unregistered');
    } catch (error) {
      console.error('[Atma PWA] Service Worker unregistration failed:', error);
    }
  };

  // Update service worker
  const update = async (): Promise<void> => {
    if (!registration) return;

    try {
      await registration.update();
      console.log('[Atma PWA] Service Worker update check completed');
    } catch (error) {
      console.error('[Atma PWA] Service Worker update failed:', error);
    }
  };

  // Skip waiting for new service worker
  const skipWaiting = (): void => {
    if (!registration?.waiting) return;

    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    setState(prev => ({ ...prev, updateAvailable: false }));
  };

  // Auto-register on component mount
  useEffect(() => {
    if (state.isSupported && !state.isRegistered && process.env.NODE_ENV === 'production') {
      register();
    }
  }, [state.isSupported]);

  return {
    ...state,
    register,
    unregister,
    update,
    skipWaiting,
  };
}

// Helper hook for PWA install prompt
export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log('[Atma PWA] Install prompt available');
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      console.log('[Atma PWA] App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!installPrompt) return false;

    try {
      const result = await installPrompt.prompt();
      const accepted = result.outcome === 'accepted';

      if (accepted) {
        setInstallPrompt(null);
        console.log('[Atma PWA] Install accepted');
      }

      return accepted;
    } catch (error) {
      console.error('[Atma PWA] Install failed:', error);
      return false;
    }
  };

  return {
    canInstall: !!installPrompt,
    isInstalled,
    install,
  };
}

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator?.onLine ?? true : true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');

      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };

      connection.addEventListener('change', handleConnectionChange);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    connectionType,
    isSlowConnection: ['slow-2g', '2g'].includes(connectionType),
  };
}