'use client';

import { subjects } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage school subjects and courses</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Add Subject
        </Button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="text-primary" size={24} />
                    {subject.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{subject.code}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded">
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className="text-2xl font-bold text-primary">{subject.credits}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1" size="sm">
                  <Edit size={16} />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700"
                  size="sm"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
