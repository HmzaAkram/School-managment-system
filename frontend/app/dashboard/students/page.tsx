'use client';

import { useState } from 'react';
import { students as initialStudents } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

type Student = typeof initialStudents[0];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student records and information</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Total {filteredStudents.length} students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Roll Number</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Class</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Attendance</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{student.rollNumber}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-foreground">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground hidden md:table-cell">{student.class}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{student.email}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-1.5 hover:bg-muted rounded text-primary"
                          title="View/Edit"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-1.5 hover:bg-muted rounded text-blue-600"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-1.5 hover:bg-muted rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Modal - Using a simple card as placeholder */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle className="text-2xl">Student Profile</CardTitle>
                <CardDescription>{selectedStudent.rollNumber}</CardDescription>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStudent(null);
                }}
                className="text-2xl hover:bg-muted p-2 rounded"
              >
                ×
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-24 h-24 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">Class {selectedStudent.class}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{selectedStudent.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Father's Name</p>
                  <p className="font-medium text-foreground">{selectedStudent.fatherName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mother's Name</p>
                  <p className="font-medium text-foreground">{selectedStudent.motherName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">{selectedStudent.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground">Attendance</p>
                  <p className="text-2xl font-bold text-primary">{selectedStudent.attendancePercentage}%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground">GPA</p>
                  <p className="text-2xl font-bold text-green-600">{selectedStudent.gpa}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-lg font-bold text-purple-600">{selectedStudent.status}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  Edit Student
                </Button>
                <Button className="flex-1">
                  View Grades
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
