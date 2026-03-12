'use client';

import { useAuth } from '@/lib/auth-context';
import {
  students,
  teachers,
  feeCollections,
  attendanceRecords,
  incomeExpenseData,
} from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();

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
      value: `${Math.round(attendanceRecords.filter((a) => a.status === 'Present').length / attendanceRecords.length * 100)}%`,
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
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your school today.
        </p>
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
                <Pie data={feeChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
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
              <LineChart data={[...Array(30)].map((_, i) => ({
                day: `Day ${i + 1}`,
                attendance: Math.floor(Math.random() * 30) + 75,
              }))}>
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
