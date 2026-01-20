// Polyfill for Temporal API (required by Schedule-X calendar)
import { Temporal } from '@js-temporal/polyfill';
// @ts-expect-error - Adding Temporal to globalThis for Schedule-X
globalThis.Temporal = Temporal;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@/lib/i18n';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
