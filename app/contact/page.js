import ContactContent from './ContactContent';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Lions Club of Homagama Diamonds. Reach out for community service inquiries, partnerships, or general questions about our club in Homagama, Sri Lanka.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Lions Club of Homagama Diamonds',
    description:
      'Get in touch with Lions Club of Homagama Diamonds for community service inquiries, partnerships, or general questions.',
    url: '/contact',
  },
};

export default function Page() {
  return <ContactContent />;
}
