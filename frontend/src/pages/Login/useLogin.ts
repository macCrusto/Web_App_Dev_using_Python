import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./loginUser";
import { toast } from "sonner";

export function useLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await loginUser({ email, password });
      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    error,
    isLoading,
  };
}
