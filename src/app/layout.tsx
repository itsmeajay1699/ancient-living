import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/provider/query-provider";
import Header from "./components/header";
import Footer from "./components/footer";
import { CartProvider } from "@/context/CartContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});



export const metadata: Metadata = {
  title: "Botanical Bloom",
  description: "Explore our collection of botanical-themed products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <CartProvider>
          <QueryProvider>
            <Header />
            {children}
            <Footer />
          </QueryProvider>
        </CartProvider>
      </body>
    </html>
  );
}
