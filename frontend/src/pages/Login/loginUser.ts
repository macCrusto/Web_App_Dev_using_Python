import { authRequest } from "@/lib/auth";

export interface LoginData {
  email?: string;
  password?: string;
}

export const loginUser = (data: LoginData) =>
  authRequest('login', data, {
    defaultErrorMessage: 'Failed to log in',
  });