import * as React from "react"

export interface AuthFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
  error?: string | null;
  isLoading?: boolean;
}

interface RequestOptions {
  method?: string;          
  headers?: HeadersInit;          
  errorMessages?: Record<number, string>; 
  defaultErrorMessage?: string;   
}

export async function authRequest<T>(
  url: string,
  body: T,
  options: RequestOptions = {}
) {
  const {
    method = 'POST',
    headers = { 'Content-Type': 'application/json' },
    errorMessages = {},
    defaultErrorMessage = 'An error occurred. Please try again.',
  } = options;

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });

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