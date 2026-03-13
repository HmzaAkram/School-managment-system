'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TabType = 'overview' | 'classes' | 'grades' | 'attendance' | 'assignments' | 'fees';

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'student') {
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
  const studentInfo = {
    name: 'Raj Kumar',
    rollNo: '10-A-042',
    class: '10-A',
    section: 'A',
    email: 'raj.kumar@school.edu',
  };

  const myClasses = [
    { subject: 'Mathematics', teacher: 'Mr. Smith', room: 'A-101' },
    { subject: 'English', teacher: 'Ms. Johnson', room: 'A-102' },
    { subject: 'Science', teacher: 'Mr. Williams', room: 'A-103' },
    { subject: 'History', teacher: 'Ms. Davis', room: 'A-104' },
    { subject: 'Geography', teacher: 'Mr. Brown', room: 'A-105' },
    { subject: 'Physical Education', teacher: 'Ms. Wilson', room: 'Gym' },
  ];

  const grades = [
    { subject: 'Mathematics', marks: 92, total: 100, grade: 'A' },
    { subject: 'English', marks: 85, total: 100, grade: 'A' },
    { subject: 'Science', marks: 88, total: 100, grade: 'A' },
    { subject: 'History', marks: 80, total: 100, grade: 'B' },
    { subject: 'Geography', marks: 87, total: 100, grade: 'A' },
  ];

  const attendanceData = [
    { subject: 'Mathematics', percentage: 95 },
    { subject: 'English', percentage: 92 },
    { subject: 'Science', percentage: 98 },
    { subject: 'History', percentage: 88 },
    { subject: 'Geography', percentage: 91 },
  ];

  const assignments = [
    { title: 'Chapter 5 Exercises', subject: 'Mathematics', dueDate: '2026-03-20', status: 'Pending' },
    { title: 'Essay on Climate Change', subject: 'Geography', dueDate: '2026-03-22', status: 'Submitted' },
    { title: 'Science Lab Report', subject: 'Science', dueDate: '2026-03-25', status: 'Pending' },
  ];

  const examSchedule = [
    { subject: 'Mathematics', date: '2026-03-28', time: '10:00 AM - 1:00 PM' },
    { subject: 'English', date: '2026-03-30', time: '2:00 PM - 4:30 PM' },
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
                BrightScope - Student
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
            { tab: 'grades', label: 'Grades' },
            { tab: 'attendance', label: 'Attendance' },
            { tab: 'assignments', label: 'Assignments' },
            { tab: 'fees', label: 'Fees' },
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome, {studentInfo.name}</h1>
              <p className="text-foreground/70 mt-2">
                Roll No: {studentInfo.rollNo} | Class: {studentInfo.class}-{studentInfo.section}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Current GPA', value: '3.8/4.0', icon: '📊' },
                { label: 'Attendance', value: '93%', icon: '✓' },
                { label: 'Assignments', value: '12/15', icon: '📝' },
                { label: 'Fees Status', value: 'Paid', icon: '✓' },
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
                  <CardTitle>Upcoming Exams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {examSchedule.map((exam, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold text-foreground">{exam.subject}</p>
                        <p className="text-sm text-foreground/70">{exam.date}</p>
                      </div>
                      <span className="text-sm text-accent font-medium">{exam.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Mid-term exams starting next week',
                    'Sports day event on March 15',
                    'Parent-teacher meeting scheduled',
                  ].map((announcement, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-accent">•</span>
                      <p className="text-foreground/80">{announcement}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* My Classes Tab */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myClasses.map((cls, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-foreground">{cls.subject}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Teacher:</span>
                      <span className="font-semibold text-foreground">{cls.teacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Room:</span>
                      <span className="font-semibold text-foreground">{cls.room}</span>
                    </div>
                    <Button className="w-full mt-4 bg-primary">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">My Grades</h1>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {grades.map((grade, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{grade.subject}</h3>
                        <p className="text-sm text-foreground/70">{grade.marks}/{grade.total}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-bold ${
                          grade.grade === 'A' ? 'text-green-600' : grade.grade === 'B' ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {grade.grade}
                        </span>
                        <p className="text-sm text-foreground/70">{Math.round((grade.marks / grade.total) * 100)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {attendanceData.map((data, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{data.subject}</h3>
                        <span className="font-bold text-primary">{data.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            data.percentage >= 90 ? 'bg-green-500' :
                            data.percentage >= 75 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {assignments.map((assignment, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                        <p className="text-sm text-foreground/70">{assignment.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">Due: {assignment.dueDate}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          assignment.status === 'Submitted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Fee Information</h1>
            <Card>
              <CardHeader>
                <CardTitle>Fee Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Annual Fees', value: '₹50,000' },
                    { label: 'Paid', value: '₹50,000' },
                    { label: 'Due', value: '₹0' },
                  ].map((item, i) => (
                    <Card key={i} className="bg-muted">
                      <CardContent className="pt-4">
                        <p className="text-foreground/70 text-sm">{item.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{item.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold flex items-center gap-2">
                    ✓ All fees are paid up to date
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Payment History</h3>
                  <div className="space-y-2">
                    {[
                      { date: '2026-01-15', amount: '₹50,000', status: 'Completed' },
                    ].map((payment, i) => (
                      <div key={i} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium text-foreground">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{payment.amount}</p>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
