'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Classes() {
  const classes = [
    { name: 'Class 10-A', teacher: 'Mr. Smith', students: 45, subjects: 6 },
    { name: 'Class 10-B', teacher: 'Ms. Johnson', students: 42, subjects: 6 },
    { name: 'Class 9-A', teacher: 'Mr. Williams', students: 48, subjects: 6 },
    { name: 'Class 9-B', teacher: 'Ms. Davis', students: 44, subjects: 6 },
    { name: 'Class 8-A', teacher: 'Mr. Brown', students: 50, subjects: 5 },
    { name: 'Class 8-B', teacher: 'Ms. Wilson', students: 46, subjects: 5 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-primary text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Our Classes</h1>
            <p className="text-lg opacity-90">
              Comprehensive class structure with experienced teachers
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls, i) => (
                <Card key={i} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-foreground text-2xl">{cls.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Teacher:</span>
                        <span className="font-semibold text-foreground">{cls.teacher}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Students:</span>
                        <span className="font-semibold text-foreground">{cls.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Subjects:</span>
                        <span className="font-semibold text-foreground">{cls.subjects}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-foreground">Class Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Classes', value: '6' },
                { label: 'Total Students', value: '275' },
                { label: 'Total Teachers', value: '6' },
                { label: 'Avg Class Size', value: '46' },
              ].map((stat, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-foreground/70">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
