import type { Metadata } from "next";
import { Inter, Syne, Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://byfust.com.br"),
  title: "BY.FUST | Cálculo Estrutural e Geotecnia",
  description:
    "Plataforma de cálculo estrutural e geotécnico para engenheiros: blocos de coroamento, capacidade de carga de estacas, vigas e pilares. Relatórios PDF automáticos.",
  keywords: [
    "cálculo estrutural",
    "engenharia estrutural",
    "blocos de coroamento",
    "geotécnica",
    "dimensionamento",
    "concreto armado",
    "fundações",
  ],
  openGraph: {
    title: "BY.FUST | Cálculo Estrutural e Geotecnia",
    description:
      "Plataforma de cálculo estrutural e geotécnico para engenheiros. Blocos de coroamento, estacas, vigas e pilares.",
    url: "https://byfust.com.br",
    siteName: "BY.FUST",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "BY.FUST | Cálculo Estrutural e Geotecnia",
    description:
      "Plataforma de cálculo estrutural e geotécnico para engenheiros.",
  },
  alternates: {
    canonical: "https://byfust.com.br",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "BY.FUST",
              applicationCategory: "EngineeringApplication",
              operatingSystem: "Web",
              url: "https://byfust.com.br",
              description:
                "Plataforma modular de cálculo estrutural para engenheiros. Blocos de coroamento, geotecnia, vigas e pilares.",
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "BRL",
                lowPrice: "79",
                highPrice: "690",
                offerCount: "4",
              },
              author: {
                "@type": "Organization",
                name: "BY.FUST",
                url: "https://byfust.com.br",
              },
              softwareHelp: {
                "@type": "WebPage",
                url: "https://byfust.com.br/#suporte",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${syne.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} font-syne antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
