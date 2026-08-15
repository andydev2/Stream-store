import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";
import CartDrawer from "../components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamStore | Tus cuentas favoritas",
  description: "Compra cuentas de Netflix, Spotify, ChatGPT y juegos al mejor precio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <SessionProviderWrapper>
          <LanguageProvider>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              {children}
              <Footer />
            </CartProvider>
          </LanguageProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
