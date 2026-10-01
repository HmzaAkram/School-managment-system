"use client";

import { BarChart3, TrendingUp, Users, Download, Calendar, DollarSign, Activity } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Platform Reports</h1>
          <p className="text-slate-500 text-sm">Comprehensive analytics and reporting for the entire platform.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Report Cards */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors p-2">
              <Download size={18} />
            </button>
          </div>
          <h3 className="font-sora font-bold text-lg text-slate-900 group-hover:text-primary transition-colors mb-2">Revenue Report</h3>
          <p className="text-slate-500 text-sm mb-4">Detailed breakdown of platform revenue, including school subscriptions and pending payments.</p>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Last updated: Today</span>
            <span className="text-primary group-hover:underline">View Full Report →</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors p-2">
              <Download size={18} />
            </button>
          </div>
          <h3 className="font-sora font-bold text-lg text-slate-900 group-hover:text-primary transition-colors mb-2">School Growth & User Stats</h3>
          <p className="text-slate-500 text-sm mb-4">Analytics on new school registrations, student enrollments, and teacher onboarding trends.</p>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Last updated: Yesterday</span>
            <span className="text-primary group-hover:underline">View Full Report →</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors p-2">
              <Download size={18} />
            </button>
          </div>
          <h3 className="font-sora font-bold text-lg text-slate-900 group-hover:text-primary transition-colors mb-2">Platform Engagement</h3>
          <p className="text-slate-500 text-sm mb-4">Metrics on daily active users, average session duration, and feature utilization across all schools.</p>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Last updated: 2 days ago</span>
            <span className="text-primary group-hover:underline">View Full Report →</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors p-2">
              <Download size={18} />
            </button>
          </div>
          <h3 className="font-sora font-bold text-lg text-slate-900 group-hover:text-primary transition-colors mb-2">Contract Renewals</h3>
          <p className="text-slate-500 text-sm mb-4">Forecast of upcoming school contract expirations and projected renewal revenue for the quarter.</p>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Last updated: 1 week ago</span>
            <span className="text-primary group-hover:underline">View Full Report →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
