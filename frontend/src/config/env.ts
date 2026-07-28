interface AppConfig {
  API_URL: string;
  ENV: string;
}

export const CONFIG: AppConfig = {
  API_URL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000',
  ENV: import.meta.env.MODE,
};