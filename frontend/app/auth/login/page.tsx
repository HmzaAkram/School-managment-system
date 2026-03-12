'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [error, setError] = useState('');

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'admin',
      label: 'Administrator',
      description: 'School management and oversight',
    },
    {
      value: 'teacher',
      label: 'Teacher',
      description: 'Classroom management',
    },
    {
      value: 'student',
      label: 'Student',
      description: 'Student portal access',
    },
    {
      value: 'parent',
      label: 'Parent',
      description: 'Parent portal access',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password, role);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  const demoCredentials = [
    { role: 'admin', email: 'admin@school.com' },
    { role: 'teacher', email: 'ramesh.sharma@school.com' },
    { role: 'student', email: 'aarav@school.com' },
    { role: 'parent', email: 'parent@school.com' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Info */}
          <div className="hidden md:flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-foreground">ABC School</h1>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6">Student Portal</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Access your academic information, attendance, grades, and school communications all in one secure
              platform.
            </p>
            <div className="space-y-4">
              {['Manage your profile', 'View grades and results', 'Track attendance', 'Communicate with teachers'].map(
                (feature) => (
                  <div key={feature} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {feature}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div>
            <Card className="border-0 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>Select your role and enter your credentials to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      {roleOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setRole(option.value);
                            setError('');
                          }}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                            role === option.value
                              ? 'border-primary bg-blue-50 text-primary'
                              : 'border-border bg-white text-foreground hover:border-primary'
                          }`}
                        >
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs opacity-70">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="text-red-600" size={20} />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Login Button */}
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-3">Demo Credentials</p>
                  <div className="space-y-2">
                    {demoCredentials.map((cred) => (
                      <button
                        key={cred.role}
                        type="button"
                        onClick={() => {
                          setRole(cred.role as UserRole);
                          setEmail(cred.email);
                          setPassword('demo');
                        }}
                        className="w-full text-left p-2 rounded text-sm hover:bg-muted transition-colors text-muted-foreground"
                      >
                        <span className="font-medium">{cred.role.charAt(0).toUpperCase() + cred.role.slice(1)}:</span> {cred.email}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
