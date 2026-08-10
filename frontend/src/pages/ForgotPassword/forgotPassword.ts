import { authRequest } from "@/lib/auth";

export const forgotPassword = (email: string) =>
  authRequest('/api/auth/forgot-password', { email }, {
    defaultErrorMessage: 'Failed to send reset link',
  });