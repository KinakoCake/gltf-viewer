import type { Metadata } from "next";
import "./globals.css";
import "./reset.css";


export const metadata: Metadata = {
  title: "gltf-viewer",
  description: "GLTF形式の3Dモデルが表示できるビューワーです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
