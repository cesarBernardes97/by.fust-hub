import type { Metadata } from "next";
import { PilarContent } from "./pilar-content";

export const metadata: Metadata = {
  title: "BY.PILAR — Dimensionamento de Pilares de Concreto Armado | BY.FUST",
  description:
    "Dimensione pilares de concreto armado com flexão composta oblíqua por fibras, efeitos de 2ª ordem automáticos e detalhamento completo. NBR 6118:2023.",
  keywords: [
    "dimensionamento pilar",
    "pilar concreto armado",
    "flexão composta oblíqua",
    "efeitos de segunda ordem",
    "NBR 6118",
    "método geral pilar",
    "curvatura aproximada",
    "rigidez kappa",
  ],
  openGraph: {
    title: "BY.PILAR — Dimensionamento de Pilares de Concreto Armado",
    description:
      "Flexão oblíqua por fibras, 2ª ordem automática, 9 seções, detalhamento completo. NBR 6118:2023.",
    url: "https://byfust.com.br/pilar",
    siteName: "BY.FUST",
    type: "website",
    locale: "pt_BR",
  },
  alternates: { canonical: "https://byfust.com.br/pilar" },
};

export default function PilarPage() {
  return <PilarContent />;
}
