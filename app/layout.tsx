import "./globals.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import ThemeRegistry from "@/lib/ThemeRegistry";
import MainLayout from "@/components/layout/MainLayout";

export const metadata = {
  title: "Hair Salon",
  description: "Hair Salon Ecommerce Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <MainLayout>{children}</MainLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
