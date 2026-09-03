import ShortVideosContent from './ShortVideosContent';

export const metadata = {
  title: 'Short Videos',
  description: 'Watch short video highlights of community service initiatives by Lions Club of Homagama Diamonds.',
  alternates: {
    canonical: '/short-videos',
  },
  openGraph: {
    title: 'Short Videos | Lions Club of Homagama Diamonds',
    description: 'Watch short video highlights of community service initiatives by Lions Club of Homagama Diamonds.',
    url: '/short-videos',
  },
};

export default function Page() {
  return <ShortVideosContent />;
}
