import { useAuth } from '@/src/context/AuthContext';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';
import type { UserRole } from '@/src/types';
import { Sparkles, Shield, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { role, switchRole } = useAuth();

  const roles: { key: UserRole; label: string; icon: typeof Shield }[] = [
    { key: 'USER', label: 'Student View', icon: GraduationCap },
    { key: 'INSTRUCTOR', label: 'Instructor View', icon: Briefcase },
    { key: 'ADMIN', label: 'Admin View', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {role === 'ADMIN' && <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <span className="font-semibold text-foreground">Active Role Perspective: </span>
            <span className="font-bold text-primary capitalize">{role.toLowerCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-muted-foreground mr-1 hidden md:inline text-[11px]">Preview as:</span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isCurrent = role === r.key;
            return (
              <Button
                key={r.key}
                size="sm"
                variant={isCurrent ? 'default' : 'outline'}
                className={`h-7 px-2.5 text-xs gap-1.5 transition-all ${
                  isCurrent ? 'shadow-xs font-semibold' : 'text-muted-foreground'
                }`}
                onClick={() => switchRole(r.key)}
              >
                <Icon className="size-3.5" />
                {r.label}
              </Button>
            );
          })}
        </div>
      </div>}

      {/* Render Role-Specific Dashboard Content */}
      {role === 'ADMIN' && <AdminDashboard />}
      {role === 'INSTRUCTOR' && <InstructorDashboard />}
      {role === 'USER' && <StudentDashboard />}
    </div>
  );
}
