import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Requested imports (Lines 5-17 maintained)
import type { AuthFormProps } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

// Extend the props to include a Google login handler
interface LoginFormProps extends AuthFormProps {
  onGoogleLogin?: () => void;
}

export function LoginForm({
  className,
  onSubmit,
  isLoading,
  onGoogleLogin,
  error,
  ...props
}: LoginFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className={cn('w-full bg-transparent border-none shadow-none', className)} {...props}>
      {/* Title & Subtitle - Further reduced margins and sizes */}
      <CardHeader className="space-y-0.5 mb-1.5 text-center p-0">
        <CardTitle className="text-xl font-extrabold text-white tracking-tight">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-[10px] text-stone-400">
          Welcome Back, Please enter Your details
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Pill Segmented Switcher - Reduced padding and margins */}
        <div className="flex rounded-lg bg-stone-900/70 p-0.5 border border-stone-800/80 mb-3 backdrop-blur-md">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 py-1 text-[10px] font-bold rounded-md bg-stone-800 text-white shadow-xs hover:bg-stone-800 cursor-default"
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/signup')}
            className="flex-1 py-1 text-[10px] font-bold rounded-md text-stone-400 hover:text-white hover:bg-transparent cursor-pointer"
          >
            Signup
          </Button>
        </div>

        {/* Error alert if any */}
        {error && (
          <div className="p-1.5 mb-2 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-medium">
            {error}
          </div>
        )}

        {/* Form Fields - Tightened spacing */}
        <form onSubmit={onSubmit}>
          <FieldGroup className="space-y-2">
            {/* Email Field */}
            <Field className="space-y-0.5">
              <FieldLabel htmlFor="email" className="text-[10px] font-semibold text-stone-300 block">
                Email Address
              </FieldLabel>
              <div className="relative flex items-center">
                <Mail className="absolute left-2.5 size-3 text-stone-400 pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full h-9 pl-8 pr-3 rounded-lg bg-stone-900/60 hover:bg-stone-900/80 focus:bg-stone-900/90 border border-stone-800/80 focus:border-purple-500 text-[11px] text-stone-100 placeholder:text-stone-500 outline-none transition-all shadow-inner"
                />
              </div>
            </Field>

            {/* Password Field */}
            <Field className="space-y-0.5">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password" className="text-[10px] font-semibold text-stone-300">
                  Password
                </FieldLabel>
                <a
                  href="/forgot-password"
                  className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-2.5 size-3 text-stone-400 pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full h-9 pl-8 pr-8 rounded-lg bg-stone-900/60 hover:bg-stone-900/80 focus:bg-stone-900/90 border border-stone-800/80 focus:border-purple-500 text-[11px] text-stone-100 placeholder:text-stone-500 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                </button>
              </div>
            </Field>

            {/* Continue Button - Reduced height */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold text-[11px] shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center mt-1"
            >
              {isLoading ? 'Signing in...' : 'Continue'}
            </Button>
          </FieldGroup>
        </form>

        {/* Or Continue With - Tightened margins */}
        <div className="relative my-3 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-800/80" />
          </div>
          <FieldDescription className="relative px-2 bg-[#040409]/80 text-[9px] font-semibold text-stone-400 uppercase tracking-wider inline-block">
            Or Continue With
          </FieldDescription>
        </div>

        {/* Social Button Row (Google, Apple, Facebook) - Reduced button and icon sizes */}
        <div className="flex items-center justify-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleLogin}
            disabled={isLoading}
            title="Sign in with Google"
            className="size-8 rounded-full bg-stone-900/70 hover:bg-stone-800/80 border border-stone-800/80 flex items-center justify-center text-white transition-all shadow-xs hover:scale-105 cursor-pointer p-0"
          >
            <svg className="size-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}