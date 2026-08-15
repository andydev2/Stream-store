import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import ThemeProviderWrapper from "../components/ThemeProviderWrapper";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";
import CartDrawer from "../components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diego Ventas | Servicios Digitales Premium",
  description: "Compra cuentas de IA, Streaming y Juegos al mejor precio. Entrega inmediata y garantía total en Diego Ventas.",
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
            <ThemeProviderWrapper>
              <CartProvider>
                <Navbar />
                <CartDrawer />
                {children}
                <Footer />
              </CartProvider>
            </ThemeProviderWrapper>
          </LanguageProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
