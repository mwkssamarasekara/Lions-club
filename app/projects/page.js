import ProjectsContent from './ProjectsContent';

export const metadata = {
  title: 'Our Projects',
  description:
    'Explore community service projects by Lions Club of Homagama Diamonds, including health camps, education drives, blood donation camps, and humanitarian initiatives in Homagama.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Our Projects | Lions Club of Homagama Diamonds',
    description:
      'Explore community service projects by Lions Club of Homagama Diamonds, including health camps, education drives, and humanitarian initiatives.',
    url: '/projects',
  },
};

export default function Page() {
  return <ProjectsContent />;
}
