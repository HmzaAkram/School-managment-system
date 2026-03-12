'use client';

import { teachers } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Award } from 'lucide-react';

export default function TeachersPublicPage() {
  return (
    <div className="w-full">
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Dedicated Teachers</h1>
          <p className="text-xl text-muted-foreground">
            Meet the experienced educators shaping the future
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-primary to-accent h-24" />
                <CardHeader className="pb-4 -mt-12 relative">
                  <div className="flex items-start gap-4">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-20 h-20 rounded-full border-4 border-white"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{teacher.name}</CardTitle>
                      <p className="text-sm text-primary font-medium mt-1">{teacher.subject}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Qualifications</p>
                    <p className="text-sm text-foreground font-medium">{teacher.qualification}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-sm text-foreground font-medium">{teacher.experience} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teaching Classes</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {teacher.classes.map((cls) => (
                        <span key={cls} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {cls}
                        </span>
                      ))}
                    </div>
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
