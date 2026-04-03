import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  jsonLd?: object;
}

export const SEO: React.FC<SEOProps> = ({ title, description, jsonLd }) => {
  return (
    <Helmet>
      <title>{title} | EnvirosAgro</title>
      <meta name="description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export const JSONLD: React.FC<{ data: object }> = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};
