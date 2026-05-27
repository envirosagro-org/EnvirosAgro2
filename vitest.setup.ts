import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock browser APIs if needed
vi.stubGlobal('navigator', { onLine: true });

// Mock firebase/app
vi.mock('firebase/app', () => {
  const dummyApp: any = {
    name: '[DEFAULT]',
    options: {},
    container: {
      getProvider: () => ({
        getImmediate: () => ({})
      })
    },
    _getProvider: () => ({
      getImmediate: () => ({})
    })
  };
  return {
    initializeApp: vi.fn(() => dummyApp),
    getApps: vi.fn(() => [dummyApp]),
    getApp: vi.fn(() => dummyApp),
  };
});

// Mock firebase/firestore to avoid IndexDB and connection errors in testing environment
vi.mock('firebase/firestore', () => {
  return {
    initializeFirestore: vi.fn(() => ({})),
    persistentLocalCache: vi.fn(),
    persistentMultipleTabManager: vi.fn(),
    getDocFromServer: vi.fn().mockResolvedValue({ exists: () => false }),
    doc: vi.fn(),
    getFirestore: vi.fn(),
  };
});

// Mock firebase/auth
vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn(() => vi.fn()),
  };
});

// Mock firebase/database
vi.mock('firebase/database', () => {
  return {
    getDatabase: vi.fn(() => ({})),
    ref: vi.fn(),
    push: vi.fn(),
    onValue: vi.fn(),
    set: vi.fn(),
    limitToLast: vi.fn(),
    query: vi.fn(),
    serverTimestamp: vi.fn(),
    off: vi.fn(),
  };
});

// Mock firebase/storage
vi.mock('firebase/storage', () => {
  return {
    getStorage: vi.fn(() => ({})),
    ref: vi.fn(),
    listAll: vi.fn(),
    getDownloadURL: vi.fn(),
    uploadBytesResumable: vi.fn(),
  };
});

// Mock firebase/data-connect
vi.mock('firebase/data-connect', () => {
  return {
    getDataConnect: vi.fn(() => ({})),
    connectDataConnectEmulator: vi.fn(),
  };
});

// Mock firebase/app-check
vi.mock('firebase/app-check', () => {
  return {
    initializeAppCheck: vi.fn(() => ({})),
    ReCaptchaV3Provider: vi.fn(),
    getToken: vi.fn().mockResolvedValue({ token: 'mock-token' }),
  };
});

// Mock motion/react so unit tests don't fail due to animation loops or gesture handlers in JSDOM
vi.mock('motion/react', () => {
  const React = require('react');
  const createMockComponent = (tag: string) => {
    return React.forwardRef(({ children, whileTap, whileHover, animate, initial, exit, transition, ...props }: any, ref: any) => {
      // Clean up motion-specific props
      return React.createElement(tag, { ...props, ref }, children);
    });
  };

  const motion: any = {};
  const tags = ['div', 'button', 'span', 'p', 'section', 'nav', 'header', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'li', 'ol', 'a', 'img', 'svg'];
  tags.forEach(tag => {
    motion[tag] = createMockComponent(tag);
  });

  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
  };
});
