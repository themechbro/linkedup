import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

export const metadata = {
  title: "LinkedUp",
  description: "It's Free and Always will be. Developed by Adrin T paul",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${robotoCondensed.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
