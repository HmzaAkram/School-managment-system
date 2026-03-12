'use client';

import { academicsInfo } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award } from 'lucide-react';

export default function AcademicsPage() {
  return (
    <div className="w-full">
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Academics</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive curriculum designed for academic excellence
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Award className="text-primary" size={32} />
            <h2 className="text-3xl font-bold text-foreground">Curriculum: {academicsInfo.curriculum}</h2>
          </div>

          <div className="space-y-8">
            {academicsInfo.classes.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cls.subjects.map((subject) => (
                      <div key={subject} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <BookOpen className="text-primary" size={20} />
                        <span className="text-foreground font-medium">{subject}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
