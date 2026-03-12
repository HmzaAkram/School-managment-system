'use client';

import { attendanceRecords, students } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AttendancePage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, string>>(
    Object.fromEntries(attendanceRecords.map((a) => [a.studentId, a.status]))
  );

  // For students: filter attendance records to only show their own
  const myAttendance = attendanceRecords.filter((r) => r.studentName === user?.name);

  const presentCount = attendance ? Object.values(attendance).filter((s) => s === 'Present').length : 0;
  const absentCount = attendance ? Object.values(attendance).filter((s) => s === 'Absent').length : 0;
  const leaveCount = attendance ? Object.values(attendance).filter((s) => s === 'Leave').length : 0;

  // Student view: read-only personal attendance
  if (isStudent) {
    const myPresent = myAttendance.filter((r) => r.status === 'Present').length;
    const myAbsent = myAttendance.filter((r) => r.status === 'Absent').length;
    const myLeave = myAttendance.filter((r) => r.status === 'Leave').length;
    const totalDays = myAttendance.length || 1;
    const attendancePct = Math.round((myPresent / totalDays) * 100);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
          <p className="text-muted-foreground mt-1">View your personal attendance record</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance %</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${attendancePct >= 75 ? 'text-green-600' : 'text-red-600'}`}>{attendancePct}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{myPresent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{myAbsent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{myLeave}</p>
            </CardContent>
          </Card>
        </div>

        {/* My Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {myAttendance.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No attendance records found.</p>
            ) : (
              <div className="space-y-2">
                {myAttendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{record.date}</p>
                      <p className="text-xs text-muted-foreground">{record.class}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === 'Present'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'Absent'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {record.status === 'Present' ? <CheckCircle size={14} /> : record.status === 'Absent' ? <XCircle size={14} /> : <Clock size={14} />}
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin/Teacher view: full mark-attendance form
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-1">Mark and manage student attendance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{leaveCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Form */}
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['Present', 'Absent', 'Leave'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setAttendance({ ...attendance, [student.id]: status })}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        attendance[student.id] === status
                          ? 'bg-primary text-white'
                          : 'bg-white border border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full">Save Attendance</Button>
        </CardContent>
      </Card>
    </div>
  );
}
