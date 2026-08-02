import AboutContent from './AboutContent';

export const metadata = {
  title: 'About Us',
  description:
    "Discover the story, mission, vision, and leadership team behind Lions Diamonds Homagama — part of Lions Clubs International, serving Homagama, Sri Lanka for over 15 years.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Lions Diamonds Homagama',
    description:
      "Discover the story, mission, vision, and leadership team behind Lions Diamonds Homagama — serving Homagama, Sri Lanka for over 15 years.",
    url: '/about',
  },
};

export default function Page() {
  return <AboutContent />;
}
