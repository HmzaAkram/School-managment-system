'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // If authenticated, go to dashboard; otherwise go to public home
    if (isAuthenticated && user?.role) {
      router.push('/dashboard');
    } else {
      router.push('/public');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-muted-foreground">Loading...</p>
    </div>
  );
}
