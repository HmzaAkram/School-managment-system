"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const valid = 
      (role === 'admin' && email === 'admin@brightscope.edu' && password === 'admin123') ||
      (role === 'teacher' && email === 'teacher@brightscope.edu' && password === 'teacher123') ||
      (role === 'student' && email === 'student@brightscope.edu' && password === 'student123');

    if (valid) {
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);
      router.push(`/${role}-dashboard`);
    } else {
      setError('Invalid credentials for selected role');
    }
  };

  const getRoleGradient = () => {
    if (role === 'admin') return 'bg-gradient-to-r from-[#3B4FE8] to-[#7C3AED]';
    if (role === 'teacher') return 'bg-gradient-to-r from-[#06B6D4] to-[#6366F1]';
    return 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899]';
  };

  const getRoleGradientText = () => {
    if (role === 'admin') return 'text-transparent bg-clip-text bg-gradient-to-r from-[#3B4FE8] to-[#7C3AED]';
    if (role === 'teacher') return 'text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#6366F1]';
    return 'text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]';
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
            BS
          </div>
          <span className="font-sora font-bold text-xl text-white">BrightScope</span>
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
            {role}@brightscope.edu<br />{role}123
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-sora font-bold text-white text-xs shadow-md ${getRoleGradient()}`}>BS</div>
            <span className="font-sora font-bold text-lg text-slate-800">BrightScope</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-sora font-extrabold text-slate-900 text-3xl mb-2">Sign into your account</h1>
            <p className="text-slate-500 mb-8">Select your role to access your dashboard.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role Select */}
              <div className="grid grid-cols-3 gap-3 mb-2">
                {[
                  { value: 'admin', label: 'Admin', icon: '⚙️' },
                  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
                  { value: 'student', label: 'Student', icon: '👨‍🎓' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      setRole(r.value as any);
                      setEmail(`${r.value}@brightscope.edu`);
                      setPassword(`${r.value}123`);
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
                Sign In →
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-8">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:text-accent transition-colors">
                Contact sales
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
