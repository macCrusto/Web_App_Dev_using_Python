import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { Toaster } from 'sonner';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  SignupPage,
  LogInPage,
  Dashboard,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='fixed top-4 right-4 z-50'>
        <ModeToggle />
      </div>
      <Router>
        <Routes>
          <Route path='/' element={<SignupPage />} />
          <Route path='/login' element={<LogInPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route
            path='/reset-password/:token'
            element={<ResetPasswordPage />}
          />
          {/* Redirect any other unknown path to the default signup route */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
      <Toaster richColors position='top-right' />
    </ThemeProvider>
  );
}

export default App;
