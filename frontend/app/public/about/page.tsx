'use client';

import { schoolInfo } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, BookOpen, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About ABC School</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Established in {schoolInfo.established}, ABC School has been a beacon of excellence for over{' '}
            {new Date().getFullYear() - schoolInfo.established} years.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                {schoolInfo.description}
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                With a dedicated team of {schoolInfo.teachers} experienced educators and state-of-the-art facilities,
                we continue to inspire {schoolInfo.students} students to achieve their dreams.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-8 text-white">
              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-bold mb-2">{schoolInfo.students}+</p>
                  <p className="text-blue-100">Active Students</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">{schoolInfo.teachers}+</p>
                  <p className="text-blue-100">Dedicated Teachers</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">{new Date().getFullYear() - schoolInfo.established}+</p>
                  <p className="text-blue-100">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="text-primary" size={32} />
                  <CardTitle>Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{schoolInfo.mission}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="text-accent" size={32} />
                  <CardTitle>Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{schoolInfo.vision}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schoolInfo.facilities.map((facility) => (
              <div key={facility} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <CheckCircle className="text-primary flex-shrink-0" size={24} />
                <span className="text-lg text-foreground font-medium">{facility}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Leadership</h2>
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  VS
                </div>
              </div>
              <CardTitle className="text-2xl">{schoolInfo.principal}</CardTitle>
              <p className="text-primary text-lg">Principal</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                With decades of experience in education, our principal leads with vision and dedication,
                ensuring that ABC School remains committed to academic excellence and holistic development.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
