import { cn } from '@/lib/utils';
import { Mail, ArrowLeft } from 'lucide-react';
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

interface ForgotPasswordFormProps extends AuthFormProps {
  success?: boolean;
}

export function ForgotPasswordForm({
  className,
  onSubmit,
  isLoading,
  error,
  success,
  ...props
}: ForgotPasswordFormProps) {
  return (
    <Card className={cn('w-full bg-transparent border-none shadow-none', className)} {...props}>
      {/* Header */}
      <CardHeader className="space-y-0.5 mb-1.5 text-center p-0">
        <CardTitle className="text-xl font-extrabold text-white tracking-tight">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-[10px] text-stone-400">
          No worries — enter your email and we'll send a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {success ? (
          /* Success State */
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5">
              <p className="text-sm font-bold text-emerald-400">Check your inbox! ✉️</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                A password reset link has been sent. It expires in 15 minutes.
              </p>
            </div>
            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-semibold text-stone-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-3" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          /* Form */
          <form onSubmit={onSubmit} className="space-y-0">
            <FieldGroup className="space-y-2">
              {/* Email */}
              <Field className="space-y-0.5">
                <FieldLabel htmlFor="fp-email" className="text-[10px] font-semibold text-stone-300 block">
                  Email Address
                </FieldLabel>
                <div className="relative flex items-center">
                  <Mail className="absolute left-2.5 size-3 text-stone-400 pointer-events-none" />
                  <Input
                    id="fp-email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="w-full h-9 pl-8 pr-3 rounded-lg bg-stone-900/60 hover:bg-stone-900/80 focus:bg-stone-900/90 border border-stone-800/80 focus:border-purple-500 text-[11px] text-stone-100 placeholder:text-stone-500 outline-none transition-all shadow-inner"
                  />
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
                {isLoading ? 'Sending...' : 'Send Reset Link'}
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
        )}
      </CardContent>
    </Card>
  );
}
