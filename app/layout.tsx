import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Souza Lima",
  description: "Controle Industrial",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}