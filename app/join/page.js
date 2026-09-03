import JoinContent from './JoinContent';

export const metadata = {
  title: 'Join Us',
  description:
    'Become a member of Lions Club of Homagama Diamonds and join a community of changemakers dedicated to service, compassion, and humanitarian work in Homagama, Sri Lanka.',
  alternates: {
    canonical: '/join',
  },
  openGraph: {
    title: 'Join Us | Lions Club of Homagama Diamonds',
    description:
      'Become a member of Lions Club of Homagama Diamonds and join a community of changemakers dedicated to service and compassion.',
    url: '/join',
  },
};

export default function Page() {
  return <JoinContent />;
}
