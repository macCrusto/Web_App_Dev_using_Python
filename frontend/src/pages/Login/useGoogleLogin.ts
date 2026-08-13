import { useEffect, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { authRequest } from '@/lib/auth';

// ---- State & Reducer ----
type State = {
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: State = { isLoading: false, error: null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return { isLoading: false, error: null };
    default:
      return state;
  }
};

// ---- Hook ----
export function useGoogleLogin() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const processed = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || processed.current) return;

    processed.current = true; // prevent double processing

    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    const errorParam = params.get('error');

    const cleanHash = () => {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    };

    if (errorParam) {
      const msg = decodeURIComponent(errorParam);
      dispatch({ type: 'SET_ERROR', payload: msg });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(msg);
      cleanHash();
      return;
    }

    if (token) {
      localStorage.setItem('access_token', token);
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.success('Logged in with Google successfully!');
      cleanHash();
      navigate('/dashboard');
    } else {
      // Hash exists but no token – something went wrong
      const msg = 'Google login failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: msg });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(msg);
      cleanHash();
    }
  }, [navigate]);

  const initiateGoogleLogin = async () => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authRequest('google', null, { method: 'GET' });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to retrieve authorization URL.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(message);
    }
  };

  return {
    initiateGoogleLogin,
    isLoading: state.isLoading,
    error: state.error,
  };
}