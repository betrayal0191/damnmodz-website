import { Suspense } from 'react';
import AuthCard from '../_components/AuthCard';

export const metadata = {
  title: 'Sign Up — DamnModz',
};

export default function SignUpPage() {
  return (
    <Suspense>
      <AuthCard initialMode="signup" />
    </Suspense>
  );
}
