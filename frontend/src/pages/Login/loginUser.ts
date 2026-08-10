import { authRequest } from "@/lib/auth";

export interface LoginData {
  email?: string;
  password?: string;
}

export const loginUser = (data: LoginData) =>
  authRequest('/api/auth/login', data, {
    defaultErrorMessage: 'Failed to log in',
  });