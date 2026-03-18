"use client";

const stats = [
  { label: 'Total Students', value: '1,248', icon: '👨‍🎓', change: '+12', changeType: 'up', color: 'from-[#3B4FE8] to-[#7C3AED]' },
  { label: 'Total Teachers',  value: '84',     icon: '👨‍🏫', change: '+2',  changeType: 'up', color: 'from-[#06B6D4] to-[#6366F1]' },
  { label: 'Fees Collected',  value: '$42.5k', icon: '💰', change: '+8%', changeType: 'up', color: 'from-[#7C3AED] to-[#EC4899]' },
  { label: 'Attendance Rate', value: '96.4%',  icon: '📋', change: '+2%', changeType: 'up', color: 'from-[#0EA5E9] to-[#3B4FE8]' },
];

const recentActivity = [
  { text: 'Fee payment received — Ali Hassan (10-A)',    time: '2 min ago',  dot: 'bg-emerald-400' },
  { text: 'Attendance marked — Grade 10-B',              time: '15 min ago', dot: 'bg-blue-400' },
  { text: 'New student enrolled — Zara Qureshi (9-A)',   time: '1 hr ago',   dot: 'bg-purple-400' },
  { text: 'Staff leave approved — Mr. Usman Raza',       time: '2 hr ago',   dot: 'bg-amber-400' },
  { text: 'Report generated — Term 2 Performance',       time: '3 hr ago',   dot: 'bg-cyan-400' },
];

function StatCard({ stat }: { stat: typeof stats[0] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(59,79,232,0.09)] hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-sm`}>
          {stat.icon}
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {stat.change} this month
        </span>
      </div>
      <div className="text-3xl font-extrabold font-sora text-slate-900 mb-1">{stat.value}</div>
      <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
    </div>
  );
}

export default function AdminOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-sora font-bold text-slate-800">Attendance This Month</h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">↑ 4.2%</span>
          </div>
          <div className="h-44 flex items-end gap-3">
            {[78,85,90,88,92,86,94,89,96,91,97,95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#3B4FE8] to-[#7C3AED] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-slate-400">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 flex-shrink-0`} />
                <div>
                  <p className="text-sm text-slate-700 leading-snug">{a.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
