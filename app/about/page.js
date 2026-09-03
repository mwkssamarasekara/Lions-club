import AboutContent from './AboutContent';

export const metadata = {
  title: 'About Us',
  description:
    "Discover the story, mission, vision, and leadership team behind Lions Club of Homagama Diamonds — part of Lions Clubs International, serving Homagama, Sri Lanka.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Lions Club of Homagama Diamonds',
    description:
      "Discover the story, mission, vision, and leadership team behind Lions Club of Homagama Diamonds — serving Homagama, Sri Lanka.",
    url: '/about',
  },
};

export default function Page() {
  return <AboutContent />;
}
