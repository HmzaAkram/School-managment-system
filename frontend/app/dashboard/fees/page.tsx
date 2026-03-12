'use client';

import { feeCollections, feeStructure } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function FeesPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const totalCollected = feeCollections.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalPending = feeCollections.reduce((acc, f) => acc + f.amountPending, 0);
  const collectionRate = ((totalCollected / (totalCollected + totalPending)) * 100).toFixed(1);

  // For students: show only their own fee record
  const myFeeRecord = feeCollections.find((f) => f.studentName === user?.name);

  // Student view: personal fees only
  if (isStudent) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Fees</h1>
          <p className="text-muted-foreground mt-1">View your fee status and payment history</p>
        </div>

        {myFeeRecord ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Fee</CardTitle>
                    <DollarSign className="text-blue-600" size={24} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">Rs {myFeeRecord.totalFee.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">Rs {myFeeRecord.amountPaid.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    <DollarSign className="text-red-600" size={24} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">Rs {myFeeRecord.amountPending.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Fee Detail Card */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Class</span>
                  <span className="font-medium text-foreground">{myFeeRecord.class}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-medium text-foreground">{myFeeRecord.dueDate}</span>
                </div>
                {myFeeRecord.paidDate && (
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Paid On</span>
                    <span className="font-medium text-foreground">{myFeeRecord.paidDate}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      myFeeRecord.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {myFeeRecord.status}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure – {myFeeRecord.class}</CardTitle>
              </CardHeader>
              <CardContent>
                {feeStructure
                  .filter((fs) => fs.class === myFeeRecord.class)
                  .map((row) => (
                    <div key={row.id} className="space-y-3">
                      {[
                        { label: 'Admission Fee', value: row.admissionFee },
                        { label: 'Tuition Fee', value: row.tuitionFee },
                        { label: 'Transport Fee', value: row.transportFee },
                        { label: 'Activity Fee', value: row.activityFee },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium text-foreground">Rs {item.value.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 pt-2">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-primary text-lg">Rs {row.totalFee.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No fee record found for your account.
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Admin/Teacher view: full fee management
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fees Management</h1>
        <p className="text-muted-foreground mt-1">Track fee collection and payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
              <DollarSign className="text-green-600" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">Rs {(totalCollected / 100000).toFixed(1)}L</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <DollarSign className="text-red-600" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">Rs {(totalPending / 100000).toFixed(1)}L</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collection Rate</CardTitle>
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{collectionRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Class</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Admission</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Tuition</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Transport</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((row) => (
                  <tr key={row.id} className="border-b border-border hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">{row.class}</td>
                    <td className="text-right px-4 py-3 text-foreground">Rs {row.admissionFee}</td>
                    <td className="text-right px-4 py-3 text-foreground">Rs {row.tuitionFee}</td>
                    <td className="text-right px-4 py-3 text-foreground">Rs {row.transportFee}</td>
                    <td className="text-right px-4 py-3 font-bold text-primary">Rs {row.totalFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Fee Collection */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Student</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Class</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Total Fee</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Paid</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Pending</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {feeCollections.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">{record.studentName}</td>
                    <td className="px-4 py-3 text-foreground hidden md:table-cell">{record.class}</td>
                    <td className="text-right px-4 py-3 text-foreground">Rs {record.totalFee}</td>
                    <td className="text-right px-4 py-3 font-medium text-green-600">Rs {record.amountPaid}</td>
                    <td className="text-right px-4 py-3 font-medium text-red-600">Rs {record.amountPending}</td>
                    <td className="text-center px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {record.status}
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
