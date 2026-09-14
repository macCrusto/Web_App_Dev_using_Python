import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/context/AuthContext';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border/80 rounded-2xl p-8 shadow-xl">
        <div className="mx-auto size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <ShieldAlert className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            403 · Access Denied
          </span>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Restricted Access
          </h1>
          <p className="text-sm text-muted-foreground">
            Your current account role is <span className="font-semibold text-primary capitalize">{role.toLowerCase()}</span>. You do not have permission to view this section.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-1.5 size-3.5" /> Go Back
          </Button>
          <Button
            className="flex-1 text-xs"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="mr-1.5 size-3.5" /> My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
