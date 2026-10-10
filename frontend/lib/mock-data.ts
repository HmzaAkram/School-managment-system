/**
 * Mock data definitions have been emptied as the application is now
 * completely powered by the Laravel backend and MySQL database.
 * TypeScript interfaces are retained for backwards compatibility.
 */

export interface SchoolContract {
  id: string;
  name: string;
  admin: string;
  phone: string;
  email: string;
  location: string;
  students: number;
  teachers: number;
  perStudentFee: number;
  schoolSharePercent: number;
  saasSharePercent: number;
  saasFeePerStudent: number;
  monthlySaaSRevenue: number;
  contractDurationMonths: number;
  contractStart: string;
  contractEnd: string;
  monthsElapsed: number;
  totalContractValue: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
  currentMonthStatus: 'Paid' | 'Pending' | 'Overdue';
  status: 'Active' | 'Pending Renewal' | 'Expired' | 'Inactive';
}

export const mockSchools: SchoolContract[] = [];

export interface SuperAdminExpense {
  id: string;
  title: string;
  category: 'Hosting & Cloud Infrastructure' | 'SMS & WhatsApp Gateway' | 'Dev & Engineering' | 'Sales & Marketing' | 'Operations & Support' | 'Office & Misc';
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'JazzCash / EasyPaisa' | 'Cash';
  notes: string;
}

export const mockExpenses: SuperAdminExpense[] = [];
export const mockMonthlyFinancials: any[] = [];
export const mockStudents: any[] = [];
export const mockTeachers: any[] = [];
export const mockClasses: any[] = [];
export const mockTransactions: any[] = [];
export const mockSupportQueries: any[] = [];
