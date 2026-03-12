'use client';

import Link from 'next/link';
import { schoolInfo, testimonials, newsArticles, events } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Award, Globe, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { number: schoolInfo.students, label: 'Students', icon: Users },
    { number: schoolInfo.teachers, label: 'Teachers', icon: Users },
    { number: new Date().getFullYear() - schoolInfo.established, label: 'Years', icon: Award },
    { number: schoolInfo.facilities.length, label: 'Facilities', icon: Globe },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Excellence in <span className="text-primary">Education</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {schoolInfo.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/public/admissions">
                  <Button size="lg">
                    Apply Now <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link href="/public/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-md h-96 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-white text-center">
                  <BookOpen size={80} className="mx-auto mb-4 opacity-80" />
                  <p className="text-2xl font-bold">ABC School</p>
                  <p className="text-sm opacity-90">Est. {schoolInfo.established}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="text-primary" size={32} />
                    </div>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.number}+</p>
                  <p className="text-muted-foreground mt-2">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are dedicated to nurturing young minds and developing them into responsible citizens
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Academic Excellence',
                description: 'Comprehensive curriculum designed for holistic development',
              },
              {
                title: 'World-Class Facilities',
                description: 'Modern infrastructure with state-of-the-art technology',
              },
              {
                title: 'Expert Teachers',
                description: 'Experienced and dedicated educators passionate about teaching',
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/public/about">
              <Button size="lg" variant="outline">
                Learn More About Us <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest News</h2>
            <p className="text-lg text-muted-foreground">Updates from ABC School</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardHeader>
                  <CardDescription className="text-sm">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </CardDescription>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{article.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-lg text-muted-foreground">Mark your calendar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.slice(0, 4).map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="h-40 bg-muted relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardHeader>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at {event.time}
                  </CardDescription>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                  <p className="text-sm text-primary font-medium">{event.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/public/events">
              <Button variant="outline" size="lg">
                View All Events <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Parents Say</h2>
            <p className="text-lg text-muted-foreground">Hear from our school community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full"
                    />
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.relation}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-4 gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.message}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join ABC School?</h2>
          <p className="text-lg mb-8 opacity-90">
            Become part of our vibrant community and experience excellence in education.
          </p>
          <Link href="/public/admissions">
            <Button size="lg" variant="secondary">
              Start Your Admission Journey <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
