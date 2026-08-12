import { authRequest } from "@/lib/auth";

export interface RegisterData {
  fullname?: string;
  email?: string;
  password?: string;
}
export const registerUser = (data: RegisterData) =>
  authRequest('register', data, {
    errorMessages: {
      409: 'An account with this email already exists.',
    },
    defaultErrorMessage: 'Failed to sign up',
  });