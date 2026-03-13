'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type TabType = 'overview' | 'classes' | 'assignments' | 'exams' | 'performance' | 'attendance';

export default function TeacherDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'teacher') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Dummy data
  const myClasses = [
    { id: 1, name: 'Class 10-A', students: 45, schedule: 'Mon, Wed, Fri 10:00 AM' },
    { id: 2, name: 'Class 10-B', students: 42, schedule: 'Tue, Thu 2:00 PM' },
  ];

  const assignments = [
    { id: 1, class: '10-A', title: 'Chapter 5 Exercises', dueDate: '2026-03-20', submissions: 38 },
    { id: 2, class: '10-B', title: 'Essay on Climate Change', dueDate: '2026-03-22', submissions: 35 },
    { id: 3, class: '10-A', title: 'Quiz Preparation', dueDate: '2026-03-25', submissions: 42 },
  ];

  const upcomingExams = [
    { id: 1, class: '10-A', subject: 'Mathematics', date: '2026-03-28', totalMarks: 100 },
    { id: 2, class: '10-B', subject: 'English', date: '2026-03-30', totalMarks: 80 },
  ];

  const studentPerformance = [
    { id: 1, name: 'Alice Smith', class: '10-A', average: '92%', status: 'Excellent' },
    { id: 2, name: 'Bob Johnson', class: '10-A', average: '78%', status: 'Good' },
    { id: 3, name: 'Carol White', class: '10-B', average: '85%', status: 'Good' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                BS
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:inline">
                BrightScope - Teacher
              </span>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { tab: 'overview', label: 'Overview' },
            { tab: 'classes', label: 'My Classes' },
            { tab: 'assignments', label: 'Assignments' },
            { tab: 'exams', label: 'Exams' },
            { tab: 'performance', label: 'Performance' },
            { tab: 'attendance', label: 'Attendance' },
          ].map((item) => (
            <Button
              key={item.tab}
              variant={activeTab === item.tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(item.tab as TabType)}
              className={activeTab === item.tab ? 'bg-primary' : ''}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome, Mr. Smith</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'My Classes', value: 2, icon: '📚' },
                { label: 'Total Students', value: 87, icon: '👨‍🎓' },
                { label: 'Assignments Set', value: 12, icon: '📝' },
                { label: 'Pending Submissions', value: 8, icon: '⏳' },
              ].map((stat, i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground/70 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <span className="text-4xl">{stat.icon}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { date: 'Today', activity: 'Class 10-A lecture' },
                    { date: 'Tomorrow', activity: 'Assignment submission deadline' },
                    { date: 'Mar 28', activity: 'Class 10-A Mathematics exam' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 pb-3 border-b last:border-0">
                      <span className="font-semibold text-primary min-w-16">{item.date}</span>
                      <span className="text-foreground/80">{item.activity}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90">Upload Assignment</Button>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white">Create Exam</Button>
                  <Button className="w-full" variant="outline">Mark Attendance</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* My Classes Tab */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myClasses.map((cls) => (
                <Card key={cls.id}>
                  <CardHeader>
                    <CardTitle className="text-foreground">{cls.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Students:</span>
                      <span className="font-semibold text-foreground">{cls.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Schedule:</span>
                      <span className="font-semibold text-foreground">{cls.schedule}</span>
                    </div>
                    <Button className="w-full mt-4 bg-primary">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
              <Button className="bg-primary">Create Assignment</Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                        <p className="text-sm text-foreground/70">Class: {assignment.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">Due: {assignment.dueDate}</p>
                        <p className="text-sm text-accent">{assignment.submissions} submissions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Manage Exams</h1>
              <Button className="bg-primary">Create Exam</Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Class</th>
                        <th className="text-left py-3 px-4 font-semibold">Subject</th>
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 font-semibold">Total Marks</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingExams.map((exam) => (
                        <tr key={exam.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{exam.class}</td>
                          <td className="py-3 px-4">{exam.subject}</td>
                          <td className="py-3 px-4">{exam.date}</td>
                          <td className="py-3 px-4">{exam.totalMarks}</td>
                          <td className="py-3 px-4"><Button size="sm" variant="outline">Edit</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Student Performance</h1>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Class</th>
                        <th className="text-left py-3 px-4 font-semibold">Average</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentPerformance.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4">{student.class}</td>
                          <td className="py-3 px-4"><span className="font-semibold text-primary">{student.average}</span></td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              student.status === 'Excellent'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {student.status}
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
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
              <Button className="bg-primary">Mark Attendance</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Class Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {myClasses.map((cls) => (
                    <div key={cls.id}>
                      <h3 className="font-semibold text-foreground mb-3">{cls.name}</h3>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground/70">Overall Attendance</span>
                          <span className="font-bold text-primary">92%</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2 mt-3">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
