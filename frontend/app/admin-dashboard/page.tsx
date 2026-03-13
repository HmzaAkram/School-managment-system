'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type TabType = 'overview' | 'teachers' | 'students' | 'classes' | 'fees' | 'attendance';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
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
  const stats = {
    students: 275,
    teachers: 6,
    classes: 6,
    pending_fees: 45000,
  };

  const teachers = [
    { id: 1, name: 'Mr. Smith', email: 'smith@school.edu', classes: 2 },
    { id: 2, name: 'Ms. Johnson', email: 'johnson@school.edu', classes: 1 },
    { id: 3, name: 'Mr. Williams', email: 'williams@school.edu', classes: 1 },
    { id: 4, name: 'Ms. Davis', email: 'davis@school.edu', classes: 1 },
    { id: 5, name: 'Mr. Brown', email: 'brown@school.edu', classes: 2 },
    { id: 6, name: 'Ms. Wilson', email: 'wilson@school.edu', classes: 1 },
  ];

  const students = [
    { id: 1, name: 'Alice Smith', class: '10-A', email: 'alice@school.edu', fees_paid: true },
    { id: 2, name: 'Bob Johnson', class: '10-A', email: 'bob@school.edu', fees_paid: false },
    { id: 3, name: 'Carol White', class: '10-B', email: 'carol@school.edu', fees_paid: true },
    { id: 4, name: 'David Brown', class: '10-B', email: 'david@school.edu', fees_paid: false },
    { id: 5, name: 'Eve Wilson', class: '9-A', email: 'eve@school.edu', fees_paid: true },
  ];

  const classes = [
    { name: 'Class 10-A', teacher: 'Mr. Smith', students: 45, avg_attendance: '92%' },
    { name: 'Class 10-B', teacher: 'Ms. Johnson', students: 42, avg_attendance: '88%' },
    { name: 'Class 9-A', teacher: 'Mr. Williams', students: 48, avg_attendance: '95%' },
    { name: 'Class 9-B', teacher: 'Ms. Davis', students: 44, avg_attendance: '90%' },
    { name: 'Class 8-A', teacher: 'Mr. Brown', students: 50, avg_attendance: '87%' },
    { name: 'Class 8-B', teacher: 'Ms. Wilson', students: 46, avg_attendance: '93%' },
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
                BrightScope - Admin
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
            { tab: 'teachers', label: 'Teachers' },
            { tab: 'students', label: 'Students' },
            { tab: 'classes', label: 'Classes' },
            { tab: 'fees', label: 'Fees' },
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
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Students', value: stats.students, icon: '👨‍🎓' },
                { label: 'Total Teachers', value: stats.teachers, icon: '👨‍🏫' },
                { label: 'Total Classes', value: stats.classes, icon: '📚' },
                { label: 'Pending Fees', value: `₹${stats.pending_fees}`, icon: '💰' },
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    'New student admission: Rohit Kumar (Class 10-A)',
                    'Fees received from 12 students',
                    'Teacher attendance marked for today',
                    'Exam schedule updated for Class 10',
                  ].map((activity, i) => (
                    <div key={i} className="flex gap-3 pb-4 border-b last:border-0">
                      <span className="text-primary text-2xl">•</span>
                      <p className="text-foreground/80">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Teachers Management</h1>
              <Button className="bg-primary">Add Teacher</Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Classes</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr key={teacher.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{teacher.name}</td>
                          <td className="py-3 px-4 text-foreground/70">{teacher.email}</td>
                          <td className="py-3 px-4">{teacher.classes}</td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="outline">Edit</Button>
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

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Students Management</h1>
              <Button className="bg-primary">Add Student</Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Class</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Fees Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4">{student.class}</td>
                          <td className="py-3 px-4 text-foreground/70">{student.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              student.fees_paid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.fees_paid ? 'Paid' : 'Pending'}
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

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Classes Management</h1>
              <Button className="bg-primary">Add Class</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((cls, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-foreground">{cls.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Teacher:</span>
                      <span className="font-semibold text-foreground">{cls.teacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Students:</span>
                      <span className="font-semibold text-foreground">{cls.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Avg Attendance:</span>
                      <span className="font-semibold text-primary">{cls.avg_attendance}</span>
                    </div>
                    <Button size="sm" className="w-full mt-4 bg-primary">Edit</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Fees Management</h1>
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Fees', value: '₹4,12,500' },
                    { label: 'Fees Collected', value: '₹3,67,500' },
                    { label: 'Pending Fees', value: '₹45,000' },
                  ].map((item, i) => (
                    <Card key={i} className="bg-muted">
                      <CardContent className="pt-4">
                        <p className="text-foreground/70 text-sm">{item.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{item.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Attendance Tracking</h1>
            <Card>
              <CardHeader>
                <CardTitle>Class Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((cls, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="font-medium text-foreground">{cls.name}</span>
                      <div className="w-64 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: cls.avg_attendance }}
                        ></div>
                      </div>
                      <span className="font-semibold text-primary">{cls.avg_attendance}</span>
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
