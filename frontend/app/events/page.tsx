'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Events() {
  const events = [
    { date: 'Mar 15, 2026', title: 'Annual Sports Day', description: 'Students compete in various athletic events' },
    { date: 'Mar 22, 2026', title: 'Science Fair', description: 'Students showcase innovative science projects' },
    { date: 'Apr 5, 2026', title: 'Cultural Week', description: 'Celebration of diverse cultures and traditions' },
    { date: 'Apr 20, 2026', title: 'Parent-Teacher Meetings', description: 'Discussion of student progress and development' },
    { date: 'May 10, 2026', title: 'Board Exams Begin', description: 'Final examinations for all classes' },
    { date: 'Jun 1, 2026', title: 'Annual Day Celebration', description: 'Awards ceremony and cultural performances' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-primary text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-lg opacity-90">
              Stay updated with important school events and activities
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-sm font-semibold text-accent mb-2">{event.date}</div>
                    <CardTitle className="text-foreground">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-foreground">Event Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['Academic', 'Sports', 'Cultural', 'Administrative'].map((category, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-3">
                      {['📚', '⚽', '🎭', '📋'][i]}
                    </div>
                    <p className="font-semibold text-foreground">{category}</p>
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
