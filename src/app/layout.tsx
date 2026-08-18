import type { Metadata } from "next";
import { Inter_Tight, Spectral, Playfair_Display, Golos_Text } from "next/font/google";
import "./globals.css";

const disp = Inter_Tight({ subsets: ["latin", "cyrillic"], weight: ["500", "700", "900"], variable: "--font-disp" });
const serif = Spectral({ subsets: ["latin", "cyrillic"], weight: ["600", "700", "800"], variable: "--font-serif" });
const ital = Playfair_Display({ subsets: ["latin", "cyrillic"], style: ["italic"], weight: ["600", "700"], variable: "--font-ital" });
const sans = Golos_Text({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PIN — Өнөөдөр мэдэхэд хангалттай",
  description: "Чухал мэдээг бид сонгож, утгыг нь тайлбарлана. Та ердөө 7 минут зарцуулна.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className={`${disp.variable} ${serif.variable} ${ital.variable} ${sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
