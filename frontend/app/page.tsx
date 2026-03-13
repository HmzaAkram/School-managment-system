'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-transparent py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Welcome to BrightScope
              </h1>
              <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
                The comprehensive platform designed for modern education. Manage students, teachers, classes, and more with ease.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/login">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Key Features</h2>
              <p className="text-lg text-foreground/70">
                Everything you need to manage your school efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Student Management',
                  description: 'Track student information, attendance, grades, and performance metrics',
                  icon: '👨‍🎓',
                },
                {
                  title: 'Teacher Dashboard',
                  description: 'Manage classes, assignments, exams, and track student progress',
                  icon: '👨‍🏫',
                },
                {
                  title: 'Admin Control',
                  description: 'Full control over fees, attendance, classes, and system management',
                  icon: '⚙️',
                },
                {
                  title: 'Real-time Reports',
                  description: 'Generate performance reports and analytics on demand',
                  icon: '📊',
                },
                {
                  title: 'Class Management',
                  description: 'Organize classes, sections, and academic schedules',
                  icon: '📚',
                },
                {
                  title: 'Fee Tracking',
                  description: 'Monitor fee payments and generate payment reports',
                  icon: '💰',
                },
              ].map((feature, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* User Roles Section */}
        <section className="bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">For Every Role</h2>
              <p className="text-lg text-foreground/70">
                Customized experience for different user types
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  role: 'Students',
                  features: ['View grades and attendance', 'Track assignments', 'Check exam schedules', 'Monitor fee status'],
                },
                {
                  role: 'Teachers',
                  features: ['Upload assignments', 'Manage exams', 'Track attendance', 'View student performance'],
                },
                {
                  role: 'Administrators',
                  features: ['Manage all data', 'Generate reports', 'Control access', 'System configuration'],
                },
              ].map((section, i) => (
                <Card key={i} className="border-primary/20 bg-white">
                  <CardHeader>
                    <CardTitle className="text-primary">{section.role}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-foreground/80">
                          <span className="h-2 w-2 rounded-full bg-accent"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your School?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join hundreds of schools using BrightScope to streamline their operations.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
