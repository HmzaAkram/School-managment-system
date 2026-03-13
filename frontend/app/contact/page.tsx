'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-primary text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg opacity-90">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Get in Touch</h2>
                <div className="space-y-6">
                  {[
                    { icon: '📍', title: 'Address', content: '123 Education Street, Learning City, LC 12345' },
                    { icon: '📞', title: 'Phone', content: '+1 (555) 123-4567' },
                    { icon: '✉️', title: 'Email', content: 'info@brightscope.edu' },
                    { icon: '🕐', title: 'Business Hours', content: 'Monday - Friday: 9:00 AM - 5:00 PM' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-foreground/70 mt-1">{item.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder="Subject"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your message"
                        rows={5}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
