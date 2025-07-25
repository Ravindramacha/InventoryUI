
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'; 
import { NotificationProvider } from './context/NotificationContext.tsx';

createRoot(document.getElementById('root')!).render(
    <NotificationProvider>
      <App />
    </NotificationProvider>
)
