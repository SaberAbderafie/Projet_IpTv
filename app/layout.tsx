
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import MainHeader from "@/components/MainHeader";

export const metadata = {
  title: "VivaVistaTV",
  description: "Plateforme d'abonnements IPTV avec Stripe et Clerk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className="bg-slate-950 text-white">
          <MainHeader />
          <main >{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
