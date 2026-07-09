import { services } from "@/content/services";
import { site, siteUrl } from "@/lib/site";

/**
 * `HairSalon` — подтип `LocalBusiness`, точнее описывает барбершоп.
 * Часы в `openingHoursSpecification`, а не строкой: их парсит Google.
 */
const openingHours = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:00",
    closes: "22:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Saturday", "Sunday"],
    opens: "11:00",
    closes: "21:00",
  },
];

const cheapest = Math.min(...services.map((service) => service.priceFrom));
const priciest = Math.max(...services.map((service) => service.priceFrom));

const schema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${siteUrl}#business`,
  name: site.legalName,
  slogan: site.slogan,
  description: site.description,
  url: siteUrl,
  telephone: site.phone,
  email: site.email,
  image: `${siteUrl}/opengraph-image`,
  priceRange: `${cheapest}–${priciest} ₽`,
  currenciesAccepted: "RUB",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    postalCode: site.address.postalCode,
    addressCountry: "RU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lon,
  },
  openingHoursSpecification: openingHours,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Услуги барбершопа",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title },
      price: service.priceFrom,
      priceCurrency: "RUB",
    })),
  },
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Данные свои, не пользовательские: XSS здесь неоткуда взяться.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
