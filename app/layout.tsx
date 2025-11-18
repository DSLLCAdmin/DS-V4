import './globals.css';
import type { Metadata } from 'next';
import DarkStreetsButton from '../components/DarkStreetsButton';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'DS LLC - Dark Streets Publishing',
  description: 'Dark Streets Publishing - Streetin\' Style Books, Merchandise, and Community',
  keywords: 'dark streets, publishing, books, street style, urban culture, merchandise',
  authors: [{ name: 'DS LLC' }],
  creator: 'DS LLC',
  publisher: 'DS LLC',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dsllc.com',
    siteName: 'DS LLC',
    title: 'DS LLC - Dark Streets Publishing',
    description: 'Dark Streets Publishing - Streetin\' Style Books, Merchandise, and Community',
    images: [
      {
        url: '/DS-WebBanner-1.webp',
        width: 1200,
        height: 630,
        alt: 'DS LLC - Dark Streets Publishing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DS LLC - Dark Streets Publishing',
    description: 'Dark Streets Publishing - Streetin\' Style Books, Merchandise, and Community',
    images: ['/DS-WebBanner-1.webp'],
  },
  alternates: {
    canonical: 'https://dsllc.com',
  },
  // Force cache refresh
  other: {
    'cache-control': 'no-cache',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        {/* Header removed - banner now handled in page.tsx */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
