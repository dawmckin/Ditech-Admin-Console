import AdminDashboard from './pages/AdminDashboard'

import { ToastProvider } from './context/ToastContext'


function App() {
  return (
    <>
      <ToastProvider>
        <AdminDashboard></AdminDashboard>
      </ToastProvider>
    </>
  )
}

export default App
