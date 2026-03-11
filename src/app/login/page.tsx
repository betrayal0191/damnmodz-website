import { Suspense } from 'react';
import AuthCard from '@/components/auth/AuthCard';

export const metadata = {
  title: 'Login — DamnModz',
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthCard initialMode="login" />
    </Suspense>
  );
}
