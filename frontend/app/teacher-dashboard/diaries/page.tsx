"use client";

import { useState } from "react";

export default function TeacherDiaries() {
  const [note, setNote] = useState('');
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Class Diary Updates</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
            <h2 className="font-sora font-bold text-slate-800 mb-5">Write New Diary Entry</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Class</label>
                  <select className="w-full text-sm border-slate-200 rounded-xl text-slate-800 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400">
                    <option>Class 10-A (Mathematics)</option>
                    <option>Class 9-B (Mathematics)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Note Type</label>
                  <select className="w-full text-sm border-slate-200 rounded-xl text-slate-800 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400">
                    <option>Homework</option>
                    <option>Classwork Notice</option>
                    <option>Reminder</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Diary Note</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g., Complete exercise 5.2 on page 45 for tomorrow..."
                  rows={4}
                  className="w-full text-sm border border-slate-200 rounded-xl text-slate-800 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 resize-none"
                />
              </div>
              
              <div className="pt-2">
                <button className="bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(6,182,212,0.25)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 transition-all w-full md:w-auto">
                  Send to Students & Parents
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-sora font-bold text-slate-800">Recent Diaries Sent (Class 10-A)</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { date: 'Today', note: 'Read chapter 4 strictly, quiz tomorrow!' },
                { date: 'Yesterday', note: 'Solve first 10 algebra questions.' }
              ].map((d, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-bold text-cyan-600 block mb-1">{d.date}</span>
                  <p className="text-sm text-slate-600 line-clamp-2">{d.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right sidebar info */}
        <div>
          <div className="bg-cyan-50 rounded-2xl border border-cyan-100 p-6">
            <h3 className="font-sora font-bold text-cyan-900 mb-2">Notice</h3>
            <p className="text-sm text-cyan-800 leading-relaxed">
              Diaries sent from this panel will instantly alert students on their dashboard and optionally send SMS/Email to registered parents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
