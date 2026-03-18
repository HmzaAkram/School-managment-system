"use client";

export default function StudentFees() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900">Fee Information</h1>
      <div className="grid sm:grid-cols-3 gap-5">
        {[
          { label: 'Annual Fees', value: '$2,500', color: 'from-[#7C3AED] to-[#EC4899]', icon: '💵' },
          { label: 'Amount Paid', value: '$2,500', color: 'from-[#10B981] to-[#06B6D4]', icon: '✅' },
          { label: 'Balance Due',  value: '$0',     color: 'from-[#6366F1] to-[#3B4FE8]', icon: '🎉' },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-transform">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl mb-4 shadow-sm`}>{f.icon}</div>
            <div className="text-sm text-slate-500 mb-1 font-medium">{f.label}</div>
            <div className="text-3xl font-extrabold font-sora text-slate-900">{f.value}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 mb-6">
          <span className="text-emerald-500 text-xl">✓</span>
          <p className="text-emerald-800 font-semibold text-sm">All fees are paid and up to date. Excellent!</p>
        </div>
        
        <h3 className="font-sora font-bold text-slate-800 mb-4">Payment History</h3>
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-100 last:border-0 hover:bg-slate-100/50 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-700">Annual Tuition Fee (Term 1 & 2)</span>
              <div className="text-xs text-slate-400 mt-1 font-medium">Receipt #49281 • Paid via Credit Card</div>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900 text-sm block mb-1">$2,500.00</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">COMPLETED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
