'use client';

import { exams, marks } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ExamsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  // For students, only show their own marks
  const myMarks = marks.filter((m) => m.studentName === user?.name);

  // Student view: read-only results
  if (isStudent) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Exam Results</h1>
          <p className="text-muted-foreground mt-1">View your exam schedules and results</p>
        </div>

        {/* Exam Schedules */}
        <div className="space-y-4">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="text-purple-600" size={28} />
                    </div>
                    <div>
                      <CardTitle>{exam.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(exam.startDate).toLocaleDateString()} -{' '}
                        {new Date(exam.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      exam.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-muted-foreground">Total Marks</p>
                    <p className="font-bold text-foreground text-lg">{exam.totalMarks}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <p className="text-xs text-muted-foreground">Passing Marks</p>
                    <p className="font-bold text-foreground text-lg">{exam.passingMarks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Results */}
        <Card>
          <CardHeader>
            <CardTitle>My Results</CardTitle>
          </CardHeader>
          <CardContent>
            {myMarks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No results available yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Subject</th>
                      <th className="text-right px-4 py-3 font-semibold text-foreground">Marks</th>
                      <th className="text-center px-4 py-3 font-semibold text-foreground">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myMarks.map((mark) => (
                      <tr key={mark.id} className="border-b border-border hover:bg-muted">
                        <td className="px-4 py-3 text-sm text-foreground">{mark.subject}</td>
                        <td className="text-right px-4 py-3 font-medium text-foreground">
                          {mark.marksObtained}/{mark.totalMarks}
                        </td>
                        <td className="text-center px-4 py-3">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                            {mark.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin/Teacher view: full exam management
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exams</h1>
          <p className="text-muted-foreground mt-1">Manage exams and schedules</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          New Exam
        </Button>
      </div>

      {/* Exams */}
      <div className="space-y-4">
        {exams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText className="text-purple-600" size={28} />
                  </div>
                  <div>
                    <CardTitle>{exam.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(exam.startDate).toLocaleDateString()} -{' '}
                      {new Date(exam.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    exam.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {exam.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-muted-foreground">Total Marks</p>
                  <p className="font-bold text-foreground text-lg">{exam.totalMarks}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-muted-foreground">Passing Marks</p>
                  <p className="font-bold text-foreground text-lg">{exam.passingMarks}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-muted-foreground">Classes</p>
                  <p className="font-bold text-foreground text-lg">{exam.classes.length}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-bold text-foreground text-sm">
                    {Math.ceil(
                      (new Date(exam.endDate).getTime() - new Date(exam.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Classes Involved</p>
                <div className="flex flex-wrap gap-2">
                  {exam.classes.map((cls) => (
                    <span key={cls} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Marks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Marks Entered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Student</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Exam</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Subject</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Marks</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark) => (
                  <tr key={mark.id} className="border-b border-border hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">{mark.studentName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">Midterm 2024</td>
                    <td className="px-4 py-3 text-sm text-foreground">{mark.subject}</td>
                    <td className="text-right px-4 py-3 font-medium text-foreground">
                      {mark.marksObtained}/{mark.totalMarks}
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {mark.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
