import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});
const siteTitle = "LinkedUp";
const siteUrl = "http://localhost:3000";
const siteDescription =
  "LinkedUp is a production-grade LinkedIn-style platform built with a Node.js gateway, Spring Boot microservices, PostgreSQL, Redis, and object storage for scalable social interactions and media delivery. It's Free and Always will be. Developed by Adrin T paul";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | LinkedUp",
  },
  description: siteDescription,
  keywords: [
    "LinkedUp",
    "Clone of Linkedin",
    "Developed by Adrin",
    "Adrin T Paul",
    "Its Free and always will be",
    "Made in India",
    "Linkedin Clone called LinkedUp",
    "Scalable System Design Engineer",
    "Adrin T Paul",
    "Adrin Paul",
    "Adrin",
  ],
  applicationName: "LinkedUp",
  authors: [{ name: "Adrin T Paul", url: siteUrl }],
  creator: "Adrin T Paul",
  publisher: "Adrin T Paul",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/Linkedup_preview.png`,
        width: 1200,
        height: 630,
        alt: "LinkedUp Site Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/portfolio_preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Adrin T Paul",
              url: siteUrl,
              sameAs: [
                "https://www.linkedin.com/in/adrintpaul/",
                "https://github.com/themechbro",
              ],
              siteName: "Linkedup",
              siteDescription: siteDescription,
              knowsAbout: [
                "Distributed Systems",
                "Microservices",
                "Redis",
                "PostgreSQL",
                "Spring Boot",
                "Node.js",
              ],
            }),
          }}
        />
      </head>
      <body className={`${robotoCondensed.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
