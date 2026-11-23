import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const titre = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-titre" });
const texte = Source_Sans_3({ subsets: ["latin"], variable: "--font-texte" });

export const metadata: Metadata = {
  title: "Tarif Juste : combien perds-tu à facturer trop bas ?",
  description: "Calcule ton tarif plancher et ton tarif conseillé en 1 minute. Gratuit, sans compte.",
  openGraph: {
    title: "Tarif Juste : combien perds-tu à facturer trop bas ?",
    description: "Calcule ton tarif plancher et ton tarif conseillé en 1 minute. Gratuit, sans compte.",
    locale: "fr_FR",
    type: "website",
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${titre.variable} ${texte.variable} bg-papier font-texte text-encre antialiased`}>
        {children}
      </body>
    </html>
  );
}
