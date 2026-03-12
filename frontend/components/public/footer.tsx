'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">ABC School</h3>
            <p className="text-gray-300 text-sm">
              Excellence in Education. Fostering minds, building futures since 1995.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/public/about" className="text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/public/academics" className="text-gray-300 hover:text-white transition">
                  Academics
                </Link>
              </li>
              <li>
                <Link href="/public/admissions" className="text-gray-300 hover:text-white transition">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/public/contact" className="text-gray-300 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="font-bold mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/public/gallery" className="text-gray-300 hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/public/events" className="text-gray-300 hover:text-white transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/public/teachers" className="text-gray-300 hover:text-white transition">
                  Our Teachers
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-300 hover:text-white transition">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Education Lane, City</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span className="text-gray-300">0123-456789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span className="text-gray-300">info@abcschool.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between py-6 text-sm text-gray-400">
          <p>&copy; {currentYear} ABC School. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
