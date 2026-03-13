'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-primary text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">About BrightScope</h1>
            <p className="text-lg opacity-90">
              Leading the revolution in educational management technology
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                BrightScope is dedicated to transforming school administration through innovative technology. We believe that modern schools deserve modern tools that simplify operations, enhance communication, and improve student outcomes.
              </p>

              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Vision</h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                To create a world where every school, regardless of size, has access to powerful management tools that allow educators to focus on what matters most: teaching and student development.
              </p>

              <h2 className="text-3xl font-bold mb-6 text-foreground">Why Choose BrightScope?</h2>
              <ul className="space-y-4">
                {[
                  'Comprehensive platform covering all aspects of school management',
                  'User-friendly interface designed for all technical levels',
                  'Real-time analytics and reporting capabilities',
                  'Secure and reliable infrastructure',
                  'Dedicated support team available 24/7',
                  'Continuous updates and feature improvements',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-foreground/80 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'John Smith', role: 'CEO & Founder' },
                { name: 'Sarah Johnson', role: 'Chief Technology Officer' },
                { name: 'Michael Chen', role: 'Head of Product' },
              ].map((member, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6">
                    <div className="h-20 w-20 rounded-full bg-primary/20 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="text-foreground/70 mt-2">{member.role}</p>
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
