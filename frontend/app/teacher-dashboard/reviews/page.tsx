"use client";

import { useState } from "react";

const students = [
  { id: 1, name: 'Ali Hassan',   class: '10-A', avatar: 'AH' },
  { id: 2, name: 'Sara Ahmed',   class: '10-A', avatar: 'SA' },
  { id: 3, name: 'Omar Sheikh',  class: '10-A', avatar: 'OS' },
  { id: 4, name: 'Zara Qureshi', class: '9-B',  avatar: 'ZQ' },
  { id: 5, name: 'Bilal Nawaz',  class: '9-B',  avatar: 'BN' },
];

export default function TeacherReviews() {
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('Excellent');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Student Reviews</h1>
      <p className="text-slate-500 text-sm mb-6">Leave performance reviews and behavioral notes for students.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 sticky top-0">
            <input 
              type="text" 
              placeholder="Search student..." 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400"
            />
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {students.map(s => (
              <button 
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${selectedStudent.id === s.id ? 'bg-cyan-50 border-l-4 border-cyan-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#6366F1] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  {s.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{s.name}</div>
                  <div className="text-xs text-slate-500">Class: {s.class}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Review form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#6366F1] flex items-center justify-center text-white text-lg font-bold shadow-sm">
              {selectedStudent.avatar}
            </div>
            <div>
              <h2 className="font-sora font-extrabold text-slate-900 text-xl">{selectedStudent.name}</h2>
              <p className="text-slate-500 text-sm font-medium">Class: {selectedStudent.class}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Performance Rating</label>
              <div className="flex gap-2">
                {['Excellent', 'Good', 'Average', 'Needs Improvement'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setRating(r)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      rating === r 
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-300 ring-2 ring-cyan-100 ring-offset-1' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Review</label>
              <textarea 
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={`Write a detailed performance review for ${selectedStudent.name}...`}
                rows={5}
                className="w-full text-sm border border-slate-200 rounded-xl text-slate-800 bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium whitespace-pre-line">
                * Reviews are visible to students on their dashboard {"\n"}
                and included in parent reports.
              </p>
              <button className="bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(6,182,212,0.25)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 transition-all">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
