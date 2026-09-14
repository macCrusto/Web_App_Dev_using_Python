import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AuthFormProps } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ResetPasswordForm({
  className,
  onSubmit,
  isLoading,
  error,
  ...props
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Card className={cn('w-full bg-transparent border-none shadow-none', className)} {...props}>
      {/* Header */}
      <CardHeader className="space-y-0.5 mb-1.5 text-center p-0">
        <CardTitle className="text-xl font-extrabold text-white tracking-tight">
          Set New Password
        </CardTitle>
        <CardDescription className="text-[10px] text-stone-400">
          Choose a strong password you haven't used before.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <form onSubmit={onSubmit}>
          <FieldGroup className="space-y-2">
            {/* New Password */}
            <Field className="space-y-0.5">
              <FieldLabel htmlFor="rp-password" className="text-[10px] font-semibold text-stone-300 block">
                New Password
              </FieldLabel>
              <div className="relative flex items-center">
                <Lock className="absolute left-2.5 size-3 text-stone-400 pointer-events-none" />
                <Input
                  id="rp-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <Field className="space-y-0.5">
              <FieldLabel htmlFor="rp-confirm" className="text-[10px] font-semibold text-stone-300 block">
                Confirm Password
              </FieldLabel>
              <div className="relative flex items-center">
                <Lock className="absolute left-2.5 size-3 text-stone-400 pointer-events-none" />
                <Input
                  id="rp-confirm"
                  name="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full h-9 pl-8 pr-8 rounded-lg bg-stone-900/60 hover:bg-stone-900/80 focus:bg-stone-900/90 border border-stone-800/80 focus:border-purple-500 text-[11px] text-stone-100 placeholder:text-stone-500 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                </button>
              </div>
            </Field>

            {/* Error */}
            {error && (
              <p className="text-[10px] text-rose-400 bg-rose-950/30 border border-rose-900/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold text-[11px] shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center mt-1"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </FieldGroup>

          {/* Back to Login */}
          <div className="pt-3 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[10px] text-stone-400 hover:text-stone-200 transition-colors"
            >
              <ArrowLeft className="size-3" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
