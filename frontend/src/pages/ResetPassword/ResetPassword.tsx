import { ResetPasswordForm } from './reset-password-form';
import { useResetPassword } from './useResetPassword';
import logo from '@/src/assets/logo.png';
import loginBg from '@/src/assets/login-page-bg.png';

export default function ResetPasswordPage() {
  const { handleSubmit, error, isLoading } = useResetPassword();

  return (
    <div
      className="relative min-h-screen h-screen w-full bg-[#00030C] bg-no-repeat bg-cover lg:bg-contain bg-position-[left_center] lg:bg-position-[right_center] transition-all font-sans overflow-x-hidden overflow-y-auto select-none"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#00030C]/40 pointer-events-none" />

      {/* Left half panel */}
      <div className="relative z-10 w-full lg:w-1/2 h-screen flex flex-col items-center justify-between p-3 lg:p-4">

        {/* Top: Brand */}
        <div className="w-full flex justify-center gap-2 font-bold text-white">
          <img src={logo} className="size-6 drop-shadow-md" alt="Axli logo" />
          <span className="tracking-tight font-extrabold text-lg">Axli</span>
        </div>

        {/* Middle: Form */}
        <div className="my-auto w-full max-w-sm">
          <ResetPasswordForm
            className="px-6"
            onSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
          />
        </div>

        {/* Bottom: Detail text */}
        <div className="w-full py-1 text-center">
          <p className="text-[10px] text-stone-400/90 leading-snug max-w-sm mx-auto">
            Your new password must be at least 8 characters. Choose something unique and memorable.
          </p>
        </div>
      </div>
    </div>
  );
}
