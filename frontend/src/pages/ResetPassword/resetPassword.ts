import { authRequest } from "@/lib/auth";

export const resetPassword = (password: string, token: string) =>
  authRequest(`/api/auth/reset-password/${token}`, { password }, {
    defaultErrorMessage: 'Failed to reset password',
  });