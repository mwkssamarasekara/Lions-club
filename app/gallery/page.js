import GalleryContent from './GalleryContent';

export const metadata = {
  title: 'Photo Gallery',
  description:
    'Browse photos from Lions Club of Homagama Diamonds community service projects, health camps, and events across Homagama, Sri Lanka.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Photo Gallery | Lions Club of Homagama Diamonds',
    description:
      'Browse photos from Lions Club of Homagama Diamonds community service projects, health camps, and events.',
    url: '/gallery',
  },
};

export default function Page() {
  return <GalleryContent />;
}
