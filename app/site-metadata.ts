import type { Metadata } from "next";
import { headers } from "next/headers";

const metadataCopy = {
  en: {
    title: "Are we living in the singularity now?",
    description:
      "A weekly, strict-definition audit of whether the technological singularity has actually arrived.",
    socialDescription:
      "The weekly verdict is NO. Here is the evidence, not the vibes.",
    imageAlt: "Are we living in the singularity now? No.",
    locale: "en_US",
    alternateLocale: "es_ES",
    path: "/",
  },
  es: {
    title: "¿Estamos viviendo ya en la singularidad?",
    description:
      "Una auditoría semanal, con definición estricta, de si la singularidad tecnológica ya ha llegado.",
    socialDescription:
      "El veredicto semanal es NO. Estas son las pruebas, no las vibras.",
    imageAlt: "¿Estamos viviendo ya en la singularidad? No.",
    locale: "es_ES",
    alternateLocale: "en_US",
    path: "/es",
  },
} as const;

export async function createLocalizedMetadata(
  locale: keyof typeof metadataCopy,
): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const copy = metadataCopy[locale];

  return {
    metadataBase: new URL(origin),
    title: copy.title,
    description: copy.description,
    authors: [{ name: "@ludthor", url: "https://github.com/ludthor" }],
    alternates: {
      canonical: `${origin}${copy.path}`,
      languages: {
        en: `${origin}/`,
        es: `${origin}/es`,
      },
    },
    openGraph: {
      type: "website",
      title: copy.title,
      description: copy.socialDescription,
      url: `${origin}${copy.path}`,
      locale: copy.locale,
      alternateLocale: copy.alternateLocale,
      images: [
        {
          url: `${origin}/og.png`,
          width: 1536,
          height: 1024,
          alt: copy.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.socialDescription,
      images: [`${origin}/og.png`],
    },
  };
}
