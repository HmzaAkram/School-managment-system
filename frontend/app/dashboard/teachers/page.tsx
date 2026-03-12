'use client';

import { teachers as initialTeachers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

type Teacher = typeof initialTeachers[0];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground mt-1">Manage faculty and staff information</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Add Teacher
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by name, subject, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{teacher.name}</CardTitle>
                  <p className="text-sm text-primary font-medium">{teacher.subject}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Qualifications</p>
                <p className="text-sm font-medium text-foreground">{teacher.qualification}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Classes</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teacher.classes.map((cls) => (
                    <span key={cls} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-medium text-foreground">{teacher.experience} years</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span className="text-foreground text-xs">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <span className="text-foreground text-xs">{teacher.phone}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No teachers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
