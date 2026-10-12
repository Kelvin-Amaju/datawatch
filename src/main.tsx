import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Capacitor } from '@capacitor/core';
import App from './App';
import './styles.css';
if (Capacitor.isNativePlatform()) document.documentElement.classList.add('native-app');
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
