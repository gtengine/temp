import "@/app/globals.css";
import { Inter } from "next/font/google";
/*********************************************************************************** */
import Header from "@/components/layouts/header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-[1184px] h-[834px]`}>
        <Header />
        <div className="px-6 py-5">{children}</div>
      </body>
    </html>
  );
}
