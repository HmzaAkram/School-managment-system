'use client';

import { classes } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Plus } from 'lucide-react';

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground mt-1">Manage classes and sections</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Add Class
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{cls.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Standard {cls.standard}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="text-primary" size={28} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-muted-foreground">Class Teacher</p>
                  <p className="font-medium text-foreground text-sm">{cls.classTeacher}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded flex items-center gap-2">
                  <Users className="text-blue-600" size={18} />
                  <div>
                    <p className="text-xs text-muted-foreground">Strength</p>
                    <p className="font-medium text-foreground text-sm">{cls.strength}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {cls.subjects.map((subject) => (
                    <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
