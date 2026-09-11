import { LoginForm } from './login-form';
import { useLogin } from './useLogin';
import { useGoogleLogin } from '@/lib/useGoogleLogin';
import logo from '@/src/assets/logo.png';
import loginBg from '@/src/assets/login-page-bg.png';

export default function LogInPage() {
  // Email/password login
  const {
    handleSubmit,
    error: emailError,
    isLoading: emailLoading,
  } = useLogin();

  // Google login
  const {
    initiateGoogleLogin,
    isLoading: googleLoading,
    error: googleError,
  } = useGoogleLogin();

  // Combine states
  const isLoading = emailLoading || googleLoading;
  const error = emailError || googleError;

  return (
    <div
      className="relative min-h-screen h-screen w-full bg-[#00030C] bg-no-repeat bg-cover lg:bg-contain bg-position-[left_center] lg:bg-position-[right_center] transition-all font-sans overflow-x-hidden overflow-y-auto select-none"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* Background dark overlay for mobile to enhance negative space contrast */}
      <div className="absolute inset-0 bg-[#00030C]/40 pointer-events-none" />

      {/* Entire Left Half Screen Assignment: Top logo, Middle form, Bottom detail */}
      {/* Reduced padding to p-3 lg:p-4 to save vertical space */}
      <div className="relative z-10 w-full lg:w-1/2 h-screen flex flex-col items-center justify-between p-3 lg:p-4">
        
        {/* Top: Brand Logo and Name */}
        <div className="w-full flex justify-center gap-2 font-bold text-white">
          <img src={logo} className="size-6 drop-shadow-md" alt="Axli logo" />
          <span className="tracking-tight font-extrabold text-lg">Axli</span>
        </div>

        {/* Middle: Centered Form with Transparent Background */}
        <div className="my-auto w-full max-w-sm">
          <LoginForm
            className="px-6"
            onSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
            onGoogleLogin={initiateGoogleLogin}
          />
        </div>

        {/* Bottom: Extra Detail Text matching reference layout */}
        <div className="w-full py-1 text-center">
          <p className="text-[10px] text-stone-400/90 leading-snug max-w-sm mx-auto">
            Join the millions of smart learners who trust us to advance their skills. Log in to access your personalized dashboard, track your learning streak, and make informed progress.
          </p>
        </div>
      </div>
    </div>
  );
}