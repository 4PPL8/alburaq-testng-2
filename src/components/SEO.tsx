import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  schema?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  type = 'website',
  image,
  schema,
}) => {
  const siteUrl = window.location.origin;
  const url = canonicalUrl || window.location.href;
  
  return (
    <HelmetProvider>
      <Helmet>
        {/* Basic meta tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {image && <meta property="og:image" content={image} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        
        {/* Schema.org markup */}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              ...schema
            })}
          </script>
        )}
      </Helmet>
    </HelmetProvider>
  );
};

export default SEO;