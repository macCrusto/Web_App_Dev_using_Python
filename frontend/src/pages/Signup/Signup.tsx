import { SignupForm } from "./signup-form";
import { useSignup } from "./useSignup";
import { useGoogleLogin } from '@/lib/useGoogleLogin';
import logo from '@/src/assets/logo.png';
import signupBg from '@/src/assets/signup-page-bg.png';

export default function SignupPage() {
    // Email/password login
    const {
      handleSubmit,
      error: emailError,
      isLoading: emailLoading,
    } = useSignup();
  
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
      className="relative h-screen w-full bg-[#02040F] bg-no-repeat bg-cover lg:bg-contain bg-position-[right_center] lg:bg-position-[left_center] transition-all font-sans overflow-hidden select-none"
      style={{
        backgroundImage: `url(${signupBg})`,
      }}
    >
      {/* Background dark overlay for mobile to enhance negative space contrast */}
      <div className="absolute inset-0 bg-[#02040F]/40 pointer-events-none" />

      {/* Entire Right Half Screen Assignment: Top logo, Middle form, Bottom detail */}
      {/* lg:ml-auto pushes this container to the right half of the screen */}
      {/* Reduced padding to p-2 lg:p-4 to save vertical space */}
      <div className="relative z-10 w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-between p-2 lg:p-4 lg:ml-auto">
        
        {/* Top: Brand Logo and Name */}
        <div className="w-full flex justify-center gap-2 font-bold text-white">
          <img src={logo} className="size-6 drop-shadow-md" alt="Axli logo" />
          <span className="tracking-tight font-extrabold text-lg">Axli</span>
        </div>

        {/* Middle: Centered Form with Transparent Background */}
        <div className="my-auto w-full max-w-sm">
          <SignupForm
            className="px-6"
            onSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
            onGoogleLogin={initiateGoogleLogin}
          />
        </div>

        {/* Bottom: Extra Detail Text matching reference layout */}
        <div className="w-full pb-1 text-center">
          <p className="text-[9px] text-stone-400/90 leading-snug max-w-sm mx-auto">
            Join millions of smart learners. Create your account to access your personalized dashboard and start advancing your skills today. 
          </p>
        </div>
      </div>
    </div>  
  );
}