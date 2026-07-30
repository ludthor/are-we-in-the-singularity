import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description =
    "A weekly, strict-definition audit of whether the technological singularity has actually arrived.";

  return {
    metadataBase: new URL(origin),
    title: "Are we living in the singularity now?",
    description,
    authors: [{ name: "@ludthor", url: "https://github.com/ludthor" }],
    openGraph: {
      type: "website",
      title: "Are we living in the singularity now?",
      description: "The weekly verdict is NO. Here is the evidence, not the vibes.",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1536,
          height: 1024,
          alt: "Are we living in the singularity now? No.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Are we living in the singularity now?",
      description: "The weekly verdict is NO. Here is the evidence, not the vibes.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
