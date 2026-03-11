import Link from 'next/link';
import SignUpOtpForm from '@/components/auth/SignUpOtpForm';

export const metadata = {
  title: 'Sign Up — DamnModz',
};

export default function SignUpPage() {
  return (
    <main className="min-h-[calc(100vh-50px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-[2px] uppercase">
            <span className="text-white">DAMN</span>
            <span className="text-accent">MODZ</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2">Create your account</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-6">
          {/* Email OTP Form */}
          <SignUpOtpForm />
        </div>

        {/* Link to Login */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
