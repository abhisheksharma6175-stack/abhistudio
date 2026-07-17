import Header from "./header/Header";
import Footer from "./footer/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}
