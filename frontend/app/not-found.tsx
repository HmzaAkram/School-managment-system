'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="inline-block">
            <div className="h-20 w-20 rounded-lg bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
              404
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
        <p className="text-foreground/70 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Go Back Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
