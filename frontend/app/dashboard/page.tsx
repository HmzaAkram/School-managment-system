'use client';

import { useAuth } from '@/lib/auth-context';
import {
  students,
  teachers,
  feeCollections,
  attendanceRecords,
  incomeExpenseData,
  marks,
} from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, DollarSign, Clock, TrendingUp, CheckCircle, FileText } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  // ─── Student Dashboard ───────────────────────────────────────────────────
  if (isStudent) {
    const myAttendance = attendanceRecords.filter((r) => r.studentName === user?.name);
    const myPresent = myAttendance.filter((r) => r.status === 'Present').length;
    const attendancePct = myAttendance.length ? Math.round((myPresent / myAttendance.length) * 100) : 0;

    const myFeeRecord = feeCollections.find((f) => f.studentName === user?.name);
    const myMarks = marks.filter((m) => m.studentName === user?.name);
    const myGpa = students.find((s) => s.name === user?.name)?.gpa ?? 0;

    const studentStats = [
      {
        title: 'Attendance',
        value: `${attendancePct}%`,
        icon: Clock,
        color: 'bg-blue-100',
        iconColor: 'text-blue-600',
        sub: attendancePct >= 75 ? 'On Track' : 'Below 75% – Alert',
        subColor: attendancePct >= 75 ? 'text-green-600' : 'text-red-500',
      },
      {
        title: 'GPA',
        value: myGpa.toFixed(1),
        icon: TrendingUp,
        color: 'bg-purple-100',
        iconColor: 'text-purple-600',
        sub: 'Current semester',
        subColor: 'text-muted-foreground',
      },
      {
        title: 'Fee Status',
        value: myFeeRecord?.status ?? 'N/A',
        icon: DollarSign,
        color: myFeeRecord?.status === 'Paid' ? 'bg-green-100' : 'bg-yellow-100',
        iconColor: myFeeRecord?.status === 'Paid' ? 'text-green-600' : 'text-yellow-600',
        sub: myFeeRecord ? `Rs ${myFeeRecord.amountPending} pending` : '',
        subColor: 'text-muted-foreground',
      },
      {
        title: 'Subjects',
        value: myMarks.length,
        icon: BookOpen,
        color: 'bg-orange-100',
        iconColor: 'text-orange-600',
        sub: 'Results recorded',
        subColor: 'text-muted-foreground',
      },
    ];

    const marksChartData = myMarks.map((m) => ({
      subject: m.subject.slice(0, 4),
      obtained: m.marksObtained,
      total: m.totalMarks,
    }));

    const recentActivity = [
      ...(myAttendance.length
        ? [{ id: 'att', activity: `Attendance marked for ${myAttendance[0].date}`, timestamp: 'Today' }]
        : []),
      ...(myFeeRecord?.paidDate
        ? [{ id: 'fee', activity: 'Fee payment received', timestamp: myFeeRecord.paidDate }]
        : []),
      { id: 'gen', activity: 'Exam schedule released', timestamp: '3 days ago' },
    ];

    return (
      <div className="space-y-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="text-primary">{user?.name}</span>!
          </h2>
          <p className="text-muted-foreground mt-2">Here's your personal academic overview.</p>
        </div>

        {/* Personal Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>{stat.title}</span>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className={stat.iconColor} size={20} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  {stat.sub && <p className={`text-xs mt-1 ${stat.subColor}`}>{stat.sub}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Marks Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>My Marks</CardTitle>
              <CardDescription>Subject-wise performance — Midterm 2024</CardDescription>
            </CardHeader>
            <CardContent>
              {marksChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={marksChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="subject" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="obtained" name="Obtained" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="total" name="Total" fill="#e2e8f0" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No marks data available yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>This term</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {[
                  { label: 'Present', count: myPresent, color: 'bg-green-500' },
                  { label: 'Absent', count: myAttendance.filter((r) => r.status === 'Absent').length, color: 'bg-red-500' },
                  { label: 'Leave', count: myAttendance.filter((r) => r.status === 'Leave').length, color: 'bg-blue-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${((item.count / (myAttendance.length || 1)) * 100).toFixed(0)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 text-center">
                  <p className="text-4xl font-bold text-primary">{attendancePct}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Overall Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & My Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Results */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>My Results</CardTitle>
              <CardDescription>Midterm Exam 2024</CardDescription>
            </CardHeader>
            <CardContent>
              {myMarks.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">No results available yet.</p>
              ) : (
                <div className="space-y-3">
                  {myMarks.map((mark) => (
                    <div key={mark.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText className="text-purple-600" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{mark.subject}</p>
                          <p className="text-xs text-muted-foreground">{mark.marksObtained}/{mark.totalMarks}</p>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {mark.grade}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Admin / Teacher Dashboard ──────────────────────────────────────────
  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Teachers',
      value: teachers.length,
      icon: Users,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Fee Collected',
      value: `Rs ${feeCollections.reduce((acc, f) => acc + f.amountPaid, 0) / 100000}L`,
      icon: DollarSign,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Avg Attendance',
      value: `${Math.round(
        (attendanceRecords.filter((a) => a.status === 'Present').length / attendanceRecords.length) * 100
      )}%`,
      icon: Clock,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  const feeStats = feeCollections.reduce(
    (acc, fee) => {
      if (fee.status === 'Paid') acc.paid += 1;
      else acc.pending += 1;
      return acc;
    },
    { paid: 0, pending: 0 }
  );

  const feeChartData = [
    { name: 'Paid', value: feeStats.paid, fill: '#3b82f6' },
    { name: 'Pending', value: feeStats.pending, fill: '#ef4444' },
  ];

  const recentActivities = [
    { id: '1', activity: 'New student admitted', timestamp: '2 hours ago' },
    { id: '2', activity: 'Exam schedule released', timestamp: '5 hours ago' },
    { id: '3', activity: 'Fee payment received', timestamp: 'Yesterday' },
    { id: '4', activity: 'Attendance report generated', timestamp: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{user?.name}</span>!
        </h2>
        <p className="text-muted-foreground mt-2">Here's what's happening with your school today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>{stat.title}</span>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className={`${stat.iconColor}`} size={20} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">Updated today</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Monthly income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fee Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Collection</CardTitle>
            <CardDescription>Payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {feeChartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attendance and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Attendance Trend</CardTitle>
            <CardDescription>Last 30 days attendance data</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={[...Array(30)].map((_, i) => ({
                  day: `Day ${i + 1}`,
                  attendance: Math.floor(Math.random() * 30) + 75,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
