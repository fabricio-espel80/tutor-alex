import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tutor Alex - Tutor de Estudos TDAH",
  description: "Um tutor de estudos paciente, empático e estruturado para ajudar crianças e adolescentes com TDAH a aprenderem melhor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
