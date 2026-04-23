import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moontrack — Your cycle. Understood.",
  description:
    "A cycle tracker that respects your privacy and actually gives useful coaching — for energy, sleep, and training.",
  openGraph: {
    title: "Moontrack — Your cycle. Understood.",
    description:
      "A cycle tracker that respects your privacy and actually gives useful coaching — for energy, sleep, and training.",
    images: [
      {
        url: "https://waitlist-api-sigma.vercel.app/api/og?title=Moontrack&accent=fuchsia&category=Health",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://waitlist-api-sigma.vercel.app/api/og?title=Moontrack&accent=fuchsia&category=Health",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-neutral-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
