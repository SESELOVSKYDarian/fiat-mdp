import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import ScrollFx from "@/components/ScrollFx";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Copa Argentina x Fiat",
  description: "Sorteos oficiales y panel administrable"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <ScrollFx />
          <Navbar />
          <div id="smooth-wrapper">
            <div id="smooth-content" className="page-shell">
              {children}
              <SiteFooter />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
