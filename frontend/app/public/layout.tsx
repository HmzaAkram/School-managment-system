import Navbar from '@/components/public/navbar';
import Footer from '@/components/public/footer';

export const metadata = {
  title: 'ABC School - Excellence in Education',
  description: 'Welcome to ABC School, a leading educational institution dedicated to providing world-class education.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
