import DonateContent from './DonateContent';

export const metadata = {
  title: 'Donate',
  description:
    'Support Lions Diamonds Homagama with a donation. Your contribution helps fund community service, health camps, and humanitarian projects in Homagama, Sri Lanka.',
  alternates: {
    canonical: '/donate',
  },
  openGraph: {
    title: 'Donate | Lions Diamonds Homagama',
    description:
      'Support Lions Diamonds Homagama with a donation. Your contribution helps fund community service and humanitarian projects.',
    url: '/donate',
  },
};

export default function Page() {
  return <DonateContent />;
}
