'use client';

import { financialSummary, incomeExpenseData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AccountsPage() {
  const stats = [
    {
      label: 'Total Income',
      value: `Rs ${(financialSummary.totalIncome / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Expenditure',
      value: `Rs ${(financialSummary.totalExpenditure / 100000).toFixed(1)}L`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Net Profit',
      value: `Rs ${(financialSummary.netProfit / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  const expenditureData = [
    { name: 'Salary', value: financialSummary.salaryExpenditure, fill: '#ef4444' },
    { name: 'Maintenance', value: financialSummary.maintenanceExpenditure, fill: '#f97316' },
    { name: 'Other', value: financialSummary.otherExpenditure, fill: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Accounts & Finance</h1>
        <p className="text-muted-foreground mt-1">Financial reports and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`${stat.color}`} size={20} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income vs Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenditure Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expenditure Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expenditureData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {expenditureData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Expenditure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                label: 'Salary Expenditure',
                amount: financialSummary.salaryExpenditure,
                percentage: (
                  (financialSummary.salaryExpenditure / financialSummary.totalExpenditure) *
                  100
                ).toFixed(1),
              },
              {
                label: 'Maintenance Expenditure',
                amount: financialSummary.maintenanceExpenditure,
                percentage: (
                  (financialSummary.maintenanceExpenditure / financialSummary.totalExpenditure) *
                  100
                ).toFixed(1),
              },
              {
                label: 'Other Expenditure',
                amount: financialSummary.otherExpenditure,
                percentage: (
                  (financialSummary.otherExpenditure / financialSummary.totalExpenditure) *
                  100
                ).toFixed(1),
              },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="font-bold text-primary">Rs {(item.amount / 100000).toFixed(1)}L</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{item.percentage}% of total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline">Export Report</Button>
        <Button>Generate PDF</Button>
      </div>
    </div>
  );
}
