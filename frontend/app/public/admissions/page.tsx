'use client';

import { admissionProcess } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function AdmissionsPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Admissions 2024-25</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join ABC School and become part of our growing community
          </p>
          <p className="text-lg font-semibold text-primary">Application Deadline: July 31, 2024</p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Admission Process</h2>
          <div className="space-y-6">
            {admissionProcess.map((process, index) => (
              <div key={process.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white font-bold text-lg">
                    {process.step}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-foreground mb-2">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Required Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Birth Certificate',
              'Previous School Records',
              'Transfer Certificate',
              'Passport Size Photo',
              'Health Records',
              'Progress Report',
              'Address Proof',
              'Parent ID Proof',
            ].map((doc) => (
              <div key={doc} className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <CheckCircle className="text-primary flex-shrink-0" size={24} />
                <span className="text-lg text-foreground font-medium">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Online Application Form</h2>
          <Card>
            <CardHeader>
              <CardTitle>Register for Admission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Student's First Name</label>
                  <Input placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Student's Last Name</label>
                  <Input placeholder="Last name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                <Input type="date" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Applying for Class</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                    <option>Class VIII</option>
                    <option>Class IX</option>
                    <option>Class X</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Previous School</label>
                  <Input placeholder="School name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Father's Name</label>
                  <Input placeholder="Father's name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Mother's Name</label>
                  <Input placeholder="Mother's name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <Input placeholder="Phone number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <Input placeholder="Full address" />
              </div>

              <Button className="w-full" size="lg">
                Submit Application <ArrowRight className="ml-2" size={20} />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Fee Structure</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b-2 border-border">
                  <th className="text-left px-4 py-3 font-bold text-foreground">Class</th>
                  <th className="text-right px-4 py-3 font-bold text-foreground">Admission Fee</th>
                  <th className="text-right px-4 py-3 font-bold text-foreground">Tuition Fee</th>
                  <th className="text-right px-4 py-3 font-bold text-foreground">Total (Monthly)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { class: 'Class VIII', admission: 5000, tuition: 3000, total: 3500 },
                  { class: 'Class IX', admission: 5500, tuition: 3500, total: 4000 },
                  { class: 'Class X', admission: 6000, tuition: 4000, total: 4500 },
                ].map((row) => (
                  <tr key={row.class} className="bg-white border-b border-border hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-foreground">{row.class}</td>
                    <td className="text-right px-4 py-3 text-foreground">Rs {row.admission.toLocaleString()}</td>
                    <td className="text-right px-4 py-3 text-foreground">Rs {row.tuition.toLocaleString()}</td>
                    <td className="text-right px-4 py-3 font-bold text-primary">Rs {row.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
