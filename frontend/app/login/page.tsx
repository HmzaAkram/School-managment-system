"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check } from "lucide-react";
import { api } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<'super-admin' | 'admin' | 'teacher' | 'student'>('super-admin');
  const [email, setEmail] = useState('superadmin@skoolms.com');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/login', {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);

      const dest =
        data.user.role === 'super_admin' ? '/super-admin-dashboard'
        : data.user.role === 'school_admin' ? '/admin-dashboard'
        : data.user.role === 'teacher' ? '/teacher-dashboard'
        : '/student-dashboard';

      router.push(dest);
    } catch (err: any) {
      setError(err?.data?.email?.[0] || err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const getRoleGradient = () => {
    if (role === 'super-admin') return 'bg-gradient-to-r from-[#2D2823] to-[#4A453F]';
    if (role === 'admin') return 'bg-gradient-to-r from-[#C4993C] to-[#D4A843]';
    if (role === 'teacher') return 'bg-gradient-to-r from-[#A37C27] to-[#C4993C]';
    return 'bg-gradient-to-r from-[#D4A843] to-[#E3C273]';
  };

  const getRoleGradientText = () => {
    if (role === 'super-admin') return 'text-transparent bg-clip-text bg-gradient-to-r from-[#2D2823] to-[#4A453F]';
    if (role === 'admin') return 'text-transparent bg-clip-text bg-gradient-to-r from-[#C4993C] to-[#D4A843]';
    if (role === 'teacher') return 'text-transparent bg-clip-text bg-gradient-to-r from-[#A37C27] to-[#C4993C]';
    return 'text-transparent bg-clip-text bg-gradient-to-r from-[#D4A843] to-[#E3C273]';
  };

  const features = [
    "Manage school operations effortlessly",
    "Real-time notifications & updates",
    "Secure role-based dashboard",
    "24/7 priority support access",
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F9FE] overflow-hidden">
      {/* Left panel — features / info */}
      <div className={`hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 animate-gradient-shift p-12 relative overflow-hidden transition-colors duration-700 ${getRoleGradient()}`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center font-sora font-bold text-white text-sm">
            SK
          </div>
          <span className="font-sora font-bold text-xl text-white">Skoolms</span>
        </Link>

        {/* Middle content */}
        <div className="relative z-10">
          <h2 className="font-sora font-extrabold text-white text-4xl leading-tight mb-6">
            Welcome back to your workspace.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Log in to securely manage your {role === 'admin' ? 'school' : role === 'teacher' ? 'classes' : 'academic journey'}.
          </p>

          <ul className="space-y-4">
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-white/90 text-sm font-medium">{f}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Admin Tip */}
        <div className="relative z-10 bg-white/10 border border-white/20 backdrop-blur rounded-2xl p-5">
          <p className="text-white/90 text-sm font-medium mb-1">
            Demo Credentials
          </p>
          <div className="text-white/80 text-xs font-mono">
            {role === 'super-admin' ? 'superadmin@skoolms.com' : `${role === 'super-admin' ? '' : role}@greenwood.com`}<br />password123
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-sora font-bold text-white text-xs shadow-md ${getRoleGradient()}`}>SK</div>
            <span className="font-sora font-bold text-lg text-slate-800">Skoolms</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-sora font-extrabold text-slate-900 text-3xl mb-2">Sign into your account</h1>
            <p className="text-slate-500 mb-8">Select your role to access your dashboard.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
                {[
                  { value: 'super-admin', label: 'Super Admin', icon: '👑' },
                  { value: 'admin', label: 'Admin', icon: '⚙️' },
                  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
                  { value: 'student', label: 'Student', icon: '👨‍🎓' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      setRole(r.value as any);
                      setEmail(r.value === 'super-admin' ? 'superadmin@skoolms.com' : r.value === 'admin' ? 'admin@greenwood.com' : r.value === 'teacher' ? 'teacher@greenwood.com' : 'student@greenwood.com');
                      setPassword('password123');
                      setError('');
                    }}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      role === r.value
                        ? `border-transparent shadow-md bg-white ring-2 ring-primary/20 ${getRoleGradientText()}`
                        : 'border-slate-100 bg-white hover:border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="text-2xl mb-1">{r.icon}</span>
                    <span className="text-xs font-bold leading-none">{r.label}</span>
                  </button>
                ))}
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl flex gap-2">
                  <span>⚠️</span> {error}
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="you@school.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-primary hover:text-accent transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 mt-2 rounded-xl text-white font-bold text-base shadow-[0_8px_24px_rgba(59,79,232,0.25)] hover:shadow-[0_16px_40px_rgba(59,79,232,0.35)] hover:-translate-y-0.5 transition-all ${getRoleGradient()}`}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-8">
              Don&apos;t have an account?{" "}
              <a
                href="https://wa.me/923152123010?text=Hello%20Skoolms%20Team%2C%20I%20would%20like%20to%20book%20a%20demo%20for%20our%20school."
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-accent transition-colors"
              >
                Book a Demo
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
