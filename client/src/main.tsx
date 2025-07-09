import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize performance monitoring
import '@/lib/performance'

createRoot(document.getElementById("root")!).render(<App />);
