import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css'
import App from './App.tsx'

import { AuthProvider } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { ReviewCategoryProvider } from './context/ReviewCategoryContext.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<ReviewCategoryProvider>
				<ToastProvider>
					<App />
				</ToastProvider>
			</ReviewCategoryProvider>
    	</AuthProvider>
  	</StrictMode>,
)
