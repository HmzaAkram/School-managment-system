'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-primary text-white mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          <div>
            <h3 className="font-bold text-lg mb-4">BrightScope</h3>
            <p className="text-sm opacity-90">
              Comprehensive school management system for modern education.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:opacity-80">Home</Link></li>
              <li><Link href="/about" className="hover:opacity-80">About</Link></li>
              <li><Link href="/events" className="hover:opacity-80">Events</Link></li>
              <li><Link href="/classes" className="hover:opacity-80">Classes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:opacity-80">Contact Us</Link></li>
              <li><a href="#" className="hover:opacity-80">FAQ</a></li>
              <li><a href="#" className="hover:opacity-80">Pricing</a></li>
              <li><a href="#" className="hover:opacity-80">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm opacity-90">
              Email: info@brightscope.edu<br/>
              Phone: +1 (555) 123-4567<br/>
              Address: 123 Education St.
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 py-6 text-center text-sm opacity-75">
          <p>&copy; 2026 BrightScope. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
