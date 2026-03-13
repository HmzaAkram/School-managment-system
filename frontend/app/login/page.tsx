'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'teacher' | 'student' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dummyCredentials = {
    admin: { email: 'admin@brightscope.edu', password: 'admin123' },
    teacher: { email: 'teacher@brightscope.edu', password: 'teacher123' },
    student: { email: 'student@brightscope.edu', password: 'student123' },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select a role');
      return;
    }

    const credentials = dummyCredentials[role];

    if (email === credentials.email && password === credentials.password) {
      // Store login info in localStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);

      // Redirect to appropriate dashboard
      if (role === 'admin') {
        router.push('/admin-dashboard');
      } else if (role === 'teacher') {
        router.push('/teacher-dashboard');
      } else {
        router.push('/student-dashboard');
      }
    } else {
      setError('Invalid credentials for selected role');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary/90 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-3xl text-white shadow-lg">
              BS
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/80 mt-2">Sign in to your BrightScope account</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">Select Your Role</CardTitle>
            <CardDescription>Choose how you access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'admin', label: 'Admin', icon: '⚙️' },
                  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
                  { value: 'student', label: 'Student', icon: '👨‍🎓' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value as 'admin' | 'teacher' | 'student')}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      role === r.value
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl">{r.icon}</span>
                    <span className="text-sm font-medium">{r.label}</span>
                  </button>
                ))}
              </div>

              {/* Credentials Display */}
              {role && (
                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                  <p className="font-medium text-foreground mb-2">Demo Credentials:</p>
                  <p className="text-foreground/70">
                    Email: <span className="font-mono">{dummyCredentials[role].email}</span>
                  </p>
                  <p className="text-foreground/70">
                    Password: <span className="font-mono">{dummyCredentials[role].password}</span>
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6">
                Sign In
              </Button>

              {/* Footer */}
              <div className="text-center text-sm pt-4 border-t border-border">
                <p className="text-foreground/70">
                  Need help?{' '}
                  <Link href="/contact" className="text-primary hover:underline font-medium">
                    Contact Support
                  </Link>
                  {' | '}
                  <Link href="/" className="text-primary hover:underline font-medium">
                    Back to Home
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
