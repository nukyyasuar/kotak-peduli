import "./globals.css";
import Header from "src/components/layout/header";
import Footer from "src/components/layout/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Header />
        <div className="min-h-[82dvh] mt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
