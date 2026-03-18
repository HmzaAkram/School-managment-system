"use client";

import { useState } from "react";

export default function AdminNotices() {
  const [notice, setNotice] = useState('');
  const [recipient, setRecipient] = useState('All');
  const [priority, setPriority] = useState('Normal');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Broadcast Notice</h1>
      <p className="text-slate-500 text-sm mb-6">Send important announcements to teachers and students.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Compose Notice</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recipients</label>
                <select 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl text-slate-800 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                >
                  <option>All Users (Teachers & Students)</option>
                  <option>Only Teachers</option>
                  <option>Only Students</option>
                  <option>Specific Class (10-A)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl text-slate-800 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                >
                  <option>Normal Routine</option>
                  <option>High / Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
              <textarea 
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                placeholder="Write the announcement details here..."
                rows={5}
                className="w-full text-sm border border-slate-200 rounded-xl text-slate-800 bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
              />
            </div>

            <div className="pt-2">
              <button className="bg-gradient-to-r from-[#3B4FE8] to-[#7C3AED] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(59,79,232,0.25)] hover:shadow-[0_6px_20px_rgba(59,79,232,0.35)] hover:-translate-y-0.5 transition-all w-full md:w-auto">
                Send Broadcast
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-sora font-bold text-slate-800">Notice History</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { date: 'Oct 24, 2026', to: 'All Users', msg: 'Winter break begins next Friday. Please ensure all assignments are submitted.', priority: 'Normal' },
              { date: 'Oct 20, 2026', to: 'Teachers',  msg: 'Staff meeting at 3:00 PM today in the main hall.', priority: 'Urgent' },
            ].map((n, i) => (
              <div key={i} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-500">{n.date}</span>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">To: {n.to}</span>
                    {n.priority === 'Urgent' && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-600">Urgent</span>}
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{n.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
