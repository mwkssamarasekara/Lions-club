const siteUrl = 'https://lionsdiamondshomagama.lk';

const routes = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/gallery', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/donate', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/join', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
