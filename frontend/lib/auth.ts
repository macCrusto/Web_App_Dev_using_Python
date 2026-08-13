import * as React from "react"

export interface AuthFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
  error?: string | null;
  isLoading?: boolean;
}

interface RequestOptions {
  method?: string;          
  headers?: HeadersInit;
  credentials?: string;          
  errorMessages?: Record<number, string>; 
  defaultErrorMessage?: string;   
}

export async function authRequest<T>(
  endpoint: string,
  body: T,
  options: RequestOptions = {}
) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    method = 'POST',
    headers = {},
    errorMessages = {},
    defaultErrorMessage = 'An error occurred. Please try again.',
  } = options;

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  // Only set Content-Type and body if we actually have a payload
  const hasBody = method !== 'GET' && method !== 'HEAD' && body !== undefined && body !== null;
  if (hasBody) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
    fetchOptions.body = JSON.stringify(body);
  }

  if (endpoint === 'google') {
    fetchOptions.credentials = 'include'
  }

  const response = await fetch(`${apiUrl}/api/auth/${endpoint}`, fetchOptions);

  if (!response.ok) {
    let errorMessage : string;

    try {
      const errorData = await response.json();
      // Prefer message from the API, then error, then a status‑specific message
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorMessages[response.status] ||
        defaultErrorMessage;
    } catch {
      // If response body is not JSON, use status‑specific or default
      errorMessage = errorMessages[response.status] || defaultErrorMessage;
    }

    throw new Error(errorMessage);
  }

  return response;
}