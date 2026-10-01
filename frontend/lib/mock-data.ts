export const mockSchools = [
  { id: 'SCH-001', name: 'Crescent International School', admin: 'Ahmad Raza', phone: '+92 300 1234567', email: 'admin@crescent.edu', location: 'Lahore, Punjab', students: 1250, teachers: 85, contractEnd: '2027-12-31', status: 'Active', paymentStatus: 'Paid' },
  { id: 'SCH-002', name: 'Beaconhouse Model Town', admin: 'Fatima Ali', phone: '+92 321 7654321', email: 'info@beaconhouse.edu', location: 'Lahore, Punjab', students: 3400, teachers: 210, contractEnd: '2028-06-30', status: 'Active', paymentStatus: 'Pending' },
  { id: 'SCH-003', name: 'City School Gulberg', admin: 'Zain Malik', phone: '+92 333 9876543', email: 'contact@cityschool.edu', location: 'Lahore, Punjab', students: 2800, teachers: 150, contractEnd: '2026-11-15', status: 'Active', paymentStatus: 'Overdue' },
  { id: 'SCH-004', name: 'Lahore Grammar School', admin: 'Sara Khan', phone: '+92 345 1122334', email: 'admin@lgs.edu', location: 'Lahore, Punjab', students: 4100, teachers: 280, contractEnd: '2029-03-01', status: 'Active', paymentStatus: 'Paid' },
  { id: 'SCH-005', name: 'Roots Millennium', admin: 'Usman Tariq', phone: '+92 301 5566778', email: 'hello@roots.edu', location: 'Islamabad', students: 1800, teachers: 110, contractEnd: '2027-08-20', status: 'Inactive', paymentStatus: 'Pending' },
];

export const mockStudents = [
  { id: 'STD-1001', rollNo: '10-A-01', name: 'Ali Hassan', class: '10-A', parent: 'Muhammad Hassan', phone: '+92 300 1112233', attendance: 98, feeStatus: 'Paid', status: 'Active' },
  { id: 'STD-1002', rollNo: '10-A-02', name: 'Ayesha Khan', class: '10-A', parent: 'Kamran Khan', phone: '+92 321 2223344', attendance: 92, feeStatus: 'Pending', status: 'Active' },
  { id: 'STD-1003', rollNo: '10-B-01', name: 'Omar Sheikh', class: '10-B', parent: 'Tariq Sheikh', phone: '+92 333 3334455', attendance: 95, feeStatus: 'Paid', status: 'Active' },
  { id: 'STD-1004', rollNo: '9-A-01', name: 'Zara Qureshi', class: '9-A', parent: 'Bilal Qureshi', phone: '+92 345 4445566', attendance: 88, feeStatus: 'Overdue', status: 'Active' },
  { id: 'STD-1005', rollNo: '9-B-01', name: 'Bilal Nawaz', class: '9-B', parent: 'Shahid Nawaz', phone: '+92 301 5556677', attendance: 97, feeStatus: 'Paid', status: 'Active' },
];

export const mockTeachers = [
  { id: 'EMP-001', name: 'Mr. Ahmad Shah', email: 'a.shah@school.edu', role: 'Senior Teacher', department: 'Mathematics', phone: '+92 300 9998877', assignedClass: '10-A', attendance: 96, salaryStatus: 'Paid', status: 'Active' },
  { id: 'EMP-002', name: 'Ms. Fatima Ali', email: 'f.ali@school.edu', role: 'Teacher', department: 'English', phone: '+92 321 8887766', assignedClass: '10-B', attendance: 99, salaryStatus: 'Paid', status: 'Active' },
  { id: 'EMP-003', name: 'Mr. Zain Khan', email: 'z.khan@school.edu', role: 'Teacher', department: 'Physics', phone: '+92 333 7776655', assignedClass: '9-A', attendance: 92, salaryStatus: 'Pending', status: 'Active' },
  { id: 'EMP-004', name: 'Ms. Sara Malik', email: 's.malik@school.edu', role: 'Teacher', department: 'Biology', phone: '+92 345 6665544', assignedClass: '9-B', attendance: 95, salaryStatus: 'Paid', status: 'Active' },
  { id: 'EMP-005', name: 'Mr. Usman Raza', email: 'u.raza@school.edu', role: 'Senior Teacher', department: 'Chemistry', phone: '+92 301 5554433', assignedClass: '8-A', attendance: 88, salaryStatus: 'Overdue', status: 'Active' },
];

export const mockClasses = [
  { id: 'CLS-001', name: 'Class 10', section: 'A', classTeacher: 'Mr. Ahmad Shah', studentsCount: 45, avgAttendance: 92, status: 'Active' },
  { id: 'CLS-002', name: 'Class 10', section: 'B', classTeacher: 'Ms. Fatima Ali', studentsCount: 42, avgAttendance: 88, status: 'Active' },
  { id: 'CLS-003', name: 'Class 9', section: 'A', classTeacher: 'Mr. Zain Khan', studentsCount: 48, avgAttendance: 95, status: 'Active' },
  { id: 'CLS-004', name: 'Class 9', section: 'B', classTeacher: 'Ms. Sara Malik', studentsCount: 44, avgAttendance: 90, status: 'Active' },
  { id: 'CLS-005', name: 'Class 8', section: 'A', classTeacher: 'Mr. Usman Raza', studentsCount: 50, avgAttendance: 87, status: 'Active' },
];

export const mockTransactions = [
  { id: 'TXN-9081', date: '2026-10-01', description: 'Fee Collection - Class 10', type: 'Credit', amount: 450000, method: 'Bank Transfer', status: 'Completed' },
  { id: 'TXN-9082', date: '2026-10-02', description: 'Electricity Bill', type: 'Debit', amount: 125000, method: 'Cash', status: 'Completed' },
  { id: 'TXN-9083', date: '2026-10-03', description: 'Fee Collection - Class 9', type: 'Credit', amount: 380000, method: 'Online', status: 'Completed' },
  { id: 'TXN-9084', date: '2026-10-05', description: 'Staff Salaries', type: 'Debit', amount: 1250000, method: 'Bank Transfer', status: 'Pending' },
  { id: 'TXN-9085', date: '2026-10-07', description: 'New Computers', type: 'Debit', amount: 350000, method: 'Bank Transfer', status: 'Completed' },
];

export const mockSupportQueries = [
  { id: 'TKT-101', subject: 'System Login Issue', user: 'Fatima Ali', role: 'Teacher', status: 'Open', priority: 'High', date: '2026-10-01' },
  { id: 'TKT-102', subject: 'Fee Receipt not generating', user: 'Muhammad Hassan', role: 'Parent', status: 'In Progress', priority: 'Medium', date: '2026-10-02' },
  { id: 'TKT-103', subject: 'Add new section in Class 8', user: 'Ahmad Raza', role: 'School Admin', status: 'Resolved', priority: 'Low', date: '2026-09-28' },
];
