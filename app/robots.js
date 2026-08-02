const siteUrl = 'https://lionsdiamondshomagama.lk';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
