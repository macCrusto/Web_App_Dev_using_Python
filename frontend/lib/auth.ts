import * as React from "react"

export interface AuthFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
  error?: string | null;
  isLoading?: boolean;
}
