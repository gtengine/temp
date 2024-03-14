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
      <body
        className={`${inter.className} min-w-[1100px] flex flex-col items-center`}
      >
        <div className="sticky top-0 w-full z-10">
          <Header />
        </div>
        <div className="w-full px-6 py-5">{children}</div>
      </body>
    </html>
  );
}
