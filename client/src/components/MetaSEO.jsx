import { Helmet } from "react-helmet-async";

const MetaSEO = ({ title, description, url, noIndex, products }) => {
  // Tạo cấu trúc dữ liệu ItemList cho Google Search
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": products?.length || 0,
    "itemListElement": products?.map((prod, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": `${window.location.origin}/product/${prod.slug}`,
        "name": prod.name,
        "image": prod.images?.[0] || "",
        "description": prod.summary || prod.name,
        "offers": {
          "@type": "Offer",
          "price": prod.price,
          "priceCurrency": "VND",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="SolarTech" />

      {/* Structured Data */}
      {products?.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default MetaSEO;