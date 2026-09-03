import DonateContent from './DonateContent';

export const metadata = {
  title: 'Donate',
  description:
    'Support Lions Club of Homagama Diamonds with a donation. Your contribution helps fund community service, health camps, and humanitarian projects in Homagama, Sri Lanka.',
  alternates: {
    canonical: '/donate',
  },
  openGraph: {
    title: 'Donate | Lions Club of Homagama Diamonds',
    description:
      'Support Lions Club of Homagama Diamonds with a donation. Your contribution helps fund community service and humanitarian projects.',
    url: '/donate',
  },
};

export default function Page() {
  return <DonateContent />;
}
