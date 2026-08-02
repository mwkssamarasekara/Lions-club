import ContactContent from './ContactContent';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Lions Diamonds Homagama. Reach out for community service inquiries, partnerships, or general questions about our club in Homagama, Sri Lanka.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Lions Diamonds Homagama',
    description:
      'Get in touch with Lions Diamonds Homagama for community service inquiries, partnerships, or general questions.',
    url: '/contact',
  },
};

export default function Page() {
  return <ContactContent />;
}
