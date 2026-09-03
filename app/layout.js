import './globals.css';
import 'aos/dist/aos.css';
import ClientLayoutShell from '@/components/ClientLayoutShell';

const siteUrl = 'https://lionsdiamondshomagama.lk';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Lions Club of Homagama Diamonds | Community Service Excellence',
    template: '%s | Lions Club of Homagama Diamonds',
  },
  description:
    'Lions Club of Homagama Diamonds - Serving the community of Homagama with compassion. Join us in making a difference through community service, donations, and volunteer programs.',
  keywords: [
    'Lions Club of Homagama Diamonds',
    'Lions Club Homagama',
    'Lions Diamonds Homagama',
    'Lions Clubs International District 306 D7',
    'community service Homagama',
    'volunteer Sri Lanka',
    'donate Homagama',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/assets/img/logo.png',
  },
  openGraph: {
    title: 'Lions Club of Homagama Diamonds | Community Service Excellence',
    description:
      'Serving the community of Homagama with compassion. Join us in making a difference through community service, donations, and volunteer programs.',
    url: siteUrl,
    siteName: 'Lions Club of Homagama Diamonds',
    images: ['/assets/img/hero-bg.jpg'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lions Club of Homagama Diamonds | Community Service Excellence',
    description:
      'Serving the community of Homagama with compassion. Join us in making a difference through community service, donations, and volunteer programs.',
    images: ['/assets/img/hero-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'AoDwewrzs8_wGxuOXVbk8fpERdNZQb0O7aycttKgfxI',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Lions Club of Homagama Diamonds',
  alternateName: 'Lions Diamonds Homagama',
  url: siteUrl,
  logo: `${siteUrl}/assets/img/logo.png`,
  description:
    'Lions Club of Homagama Diamonds serves the community of Homagama, Sri Lanka through humanitarian projects, health camps, donations, and volunteer programs, as part of Lions Clubs International District 306 D7.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Homagama',
    addressCountry: 'LK',
  },
  memberOf: {
    '@type': 'Organization',
    name: 'Lions Clubs International',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  );
}
