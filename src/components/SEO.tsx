import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

/**
 * SEO Component - Manages meta tags for search engines and social media
 *
 * @param title - Page title (appears in browser tab and Google results)
 * @param description - Page description (appears in Google search results)
 * @param canonical - Canonical URL (helps prevent duplicate content issues)
 * @param ogImage - Open Graph image URL (for social media sharing)
 * @param ogType - Open Graph type (default: "website")
 */
export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website"
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}
