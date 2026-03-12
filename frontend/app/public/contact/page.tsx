'use client';

import { schoolInfo } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="w-full">
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with ABC School for any inquiries
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <CardTitle className="text-lg">Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-medium">{schoolInfo.address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <CardTitle className="text-lg">Phone</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-medium">{schoolInfo.phone}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Mail className="text-purple-600" size={24} />
                  </div>
                  <CardTitle className="text-lg">Email</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-medium">{schoolInfo.email}</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <Input placeholder="First name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <Input placeholder="Last name" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <Input placeholder="Message subject" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="Your message..."
                    rows={4}
                  />
                </div>

                <Button className="w-full" size="lg">
                  Send Message <Send className="ml-2" size={20} />
                </Button>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">Office Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Monday to Friday</h3>
                    <p className="text-muted-foreground">8:00 AM - 4:00 PM</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Saturday</h3>
                    <p className="text-muted-foreground">9:00 AM - 1:00 PM</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Sunday</h3>
                    <p className="text-muted-foreground">Closed</p>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-bold text-foreground mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                      {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                          {social.charAt(0)}
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
