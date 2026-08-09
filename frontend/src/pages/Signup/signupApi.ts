export interface RegisterData {
  fullname?: string;
  email?: string;
  password?: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to sign up";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      if (response.status === 409) {
        errorMessage = "An account with this email already exists.";
      }
    }
    throw new Error(errorMessage);
  }

  return response;
};
