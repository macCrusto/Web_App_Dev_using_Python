import * as React from 'react';
import {
  GraduationCap,
  BookOpenCheck,
  Clock,
  Lock,
  Sparkles,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  X,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/src/context/AuthContext';
import type { UserRole } from '@/src/types';
import { toast } from 'sonner';

const COOLDOWN_HOURS = 12;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isCooldownActive: boolean;
  nextAvailableDate: Date | null;
  percentageElapsed: number;
}

function calculateCooldown(lastSwitchTime?: string | null): TimeRemaining {
  if (!lastSwitchTime) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isCooldownActive: false,
      nextAvailableDate: null,
      percentageElapsed: 100,
    };
  }

  const lastSwitchMs = new Date(lastSwitchTime).getTime();
  if (isNaN(lastSwitchMs)) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isCooldownActive: false,
      nextAvailableDate: null,
      percentageElapsed: 100,
    };
  }

  const nowMs = Date.now();
  const elapsedMs = nowMs - lastSwitchMs;

  if (elapsedMs >= COOLDOWN_MS) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isCooldownActive: false,
      nextAvailableDate: null,
      percentageElapsed: 100,
    };
  }

  const remainingMs = COOLDOWN_MS - elapsedMs;
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const nextAvailableDate = new Date(lastSwitchMs + COOLDOWN_MS);
  const percentageElapsed = Math.min(100, Math.max(0, (elapsedMs / COOLDOWN_MS) * 100));

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    isCooldownActive: true,
    nextAvailableDate,
    percentageElapsed,
  };
}

export function RoleSwitcherCard() {
  const { user, role, switchRole } = useAuth();
  const [cooldown, setCooldown] = React.useState<TimeRemaining>(() =>
    calculateCooldown(user?.last_role_switch)
  );
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [isSwitching, setIsSwitching] = React.useState(false);

  // Live countdown timer ticking every second
  React.useEffect(() => {
    const update = () => {
      setCooldown(calculateCooldown(user?.last_role_switch));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [user?.last_role_switch]);

  // Determine target role for to-and-fro switching
  const targetRole: UserRole = role === 'INSTRUCTOR' ? 'USER' : 'INSTRUCTOR';
  const targetRoleName = targetRole === 'INSTRUCTOR' ? 'Instructor' : 'Student (Learner)';
  const currentRoleName = role === 'INSTRUCTOR' ? 'Instructor' : role === 'ADMIN' ? 'Administrator' : 'Student';

  const handleInitiateSwitch = () => {
    if (cooldown.isCooldownActive) {
      toast.error(
        `Role switch is on cooldown. Please wait ${cooldown.hours}h ${cooldown.minutes}m ${cooldown.seconds}s.`
      );
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecuteSwitch = async () => {
    setIsSwitching(true);
    try {
      const result = await switchRole(targetRole);
      if (result.success) {
        toast.success(result.message || `Successfully switched to ${targetRoleName}! 🎉`);
        setShowConfirmModal(false);
      } else {
        toast.error(result.message || 'Failed to switch role.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while switching role.';
      toast.error(msg);
    } finally {
      setIsSwitching(false);
    }
  };

  const formatTime = (val: number) => String(val).padStart(2, '0');

  return (
    <>
      <Card className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-5 transition-all">
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
              {role === 'INSTRUCTOR' ? (
                <BookOpenCheck className="size-5" />
              ) : (
                <GraduationCap className="size-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Teaching & Platform Role</h3>
                {role === 'INSTRUCTOR' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" /> Verified Educator
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Current Role:{' '}
                <span className="font-semibold text-foreground uppercase tracking-wide">
                  {currentRoleName}
                </span>
              </p>
            </div>
          </div>

          {/* Cooldown Status Badge */}
          {cooldown.isCooldownActive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold border border-amber-500/20">
              <Clock className="size-3 animate-pulse" />
              {formatTime(cooldown.hours)}:{formatTime(cooldown.minutes)}:{formatTime(cooldown.seconds)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
              <Sparkles className="size-3" /> Switch Ready
            </span>
          )}
        </div>

        {/* Informative Explanation */}
        <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 p-4 space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <ArrowRightLeft className="size-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                {role === 'INSTRUCTOR'
                  ? 'Switch to Student (Learner) Perspective'
                  : 'Switch to Instructor Role & Start Teaching'}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {role === 'INSTRUCTOR'
                  ? 'Switch back to the learner perspective to browse the full catalog, enroll in courses, and complete student curriculum.'
                  : 'Become an instructor to unlock the Course Studio, create modular courses, upload lesson videos, and teach students worldwide.'}
              </p>
            </div>
          </div>

          {/* 12-Hour Cooldown Details */}
          <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-stone-400" />
              12-Hour Cooldown Rule
            </span>
            <span className="font-medium text-stone-600 dark:text-stone-300">
              {cooldown.isCooldownActive ? 'Cooldown In Progress' : 'No Active Delay'}
            </span>
          </div>
        </div>

        {/* Active Cooldown Banner with Progress Indicator */}
        {cooldown.isCooldownActive && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Lock className="size-3.5" />
                Role Switch Locked (12h Policy)
              </span>
              <span className="font-mono text-xs">
                {cooldown.hours}h {cooldown.minutes}m {cooldown.seconds}s remaining
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-amber-200/50 dark:bg-amber-950/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${cooldown.percentageElapsed}%` }}
              />
            </div>

            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 leading-tight">
              To ensure platform and enrollment consistency, role switching is delayed by 12 hours. Next available switch at:{' '}
              <span className="font-semibold">
                {cooldown.nextAvailableDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                {cooldown.nextAvailableDate?.toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </p>
          </div>
        )}

        {/* Action Button */}
        <div>
          <Button
            type="button"
            disabled={cooldown.isCooldownActive || isSwitching}
            onClick={handleInitiateSwitch}
            className={`w-full h-11 rounded-2xl font-bold text-xs gap-2 transition-all shadow-xs cursor-pointer ${
              cooldown.isCooldownActive
                ? 'opacity-60 cursor-not-allowed bg-stone-200 dark:bg-stone-800 text-stone-500'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.01]'
            }`}
          >
            {cooldown.isCooldownActive ? (
              <>
                <Lock className="size-4" />
                Switch Locked ({cooldown.hours}h {cooldown.minutes}m remaining)
              </>
            ) : role === 'INSTRUCTOR' ? (
              <>
                <GraduationCap className="size-4" />
                Switch Role to Student
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Switch Role to Instructor
              </>
            )}
          </Button>
          {!cooldown.isCooldownActive && (
            <p className="text-[10px] text-center text-muted-foreground mt-1.5">
              Notice: Switching will activate a 12-hour lock period before you can switch again.
            </p>
          )}
        </div>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground">Confirm Role Switch</h4>
                  <p className="text-xs text-muted-foreground">12-Hour Cooldown Agreement</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Warning Message */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                <ShieldAlert className="size-4" />
                12-Hour Lock Period Activated Upon Switch
              </div>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                You are about to change your role from <span className="font-bold underline">{currentRoleName}</span> to{' '}
                <span className="font-bold underline">{targetRoleName}</span>.
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                Once confirmed, you will <strong>NOT</strong> be able to switch back to {currentRoleName} for 12 hours (43,200 seconds).
              </p>
            </div>

            {/* Permission Summary */}
            <div className="rounded-2xl border border-stone-100 dark:border-stone-800 p-3.5 space-y-2 text-xs bg-stone-50/50 dark:bg-stone-950/40">
              <p className="font-semibold text-foreground">
                What changes when switching to {targetRoleName}:
              </p>
              <ul className="space-y-1.5 text-muted-foreground text-[11px]">
                {targetRole === 'INSTRUCTOR' ? (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      Access to Course Studio to create, edit, and publish courses.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      Instructor Analytics and student enrollment management.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      Public instructor badge displayed on your profile.
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      Browse and purchase courses as a student learner.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      Clean student dashboard and certificate progress tracking.
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSwitching}
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl text-xs px-4"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSwitching}
                onClick={handleExecuteSwitch}
                className="rounded-xl text-xs px-5 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs"
              >
                {isSwitching ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Switching...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    Confirm & Switch to {targetRole === 'INSTRUCTOR' ? 'Instructor' : 'Student'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
