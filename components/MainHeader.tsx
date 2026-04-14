// components/MainHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

const navLinks = [
  { href: "/plans", label: "Plans IPTV" },
  { href: "/mes-abonnements", label: "Mes abonnements" },
  { href: "/historique", label: "Historique" },
  { href: "/activer", label: "Activer un code" },
  { href: "/direct", label: "Live" },
  { href: "/guide", label: "Guide" },
  { href: "/favoris", label: "Favoris" },
  { href: "/profil", label: "Profil" },
  { href: "/en-direct", label: "En directe" },
];

export default function MainHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-orange-400 bg-slate-950 backdrop-blur text-white p-2 ">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo / nom du site */}
        {/* <Link href="/" className="text-lg font-bold text-green-400">
          VivaVistaTV
        </Link> */}
         <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
              <span className="text-lg font-extrabold text-white"><Link href="/">▶</Link></span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
             <Link href="/">vivavista</Link> <span className="text-orange-400">tv</span>
            </span>
          </div>

        {/* Liens de navigation */}
        <nav className="flex items-center gap-5 text-sm">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "transition-colors " +
                  (active
                    ? "text-emerald-400 border-b-2 border-emerald-400 pb-1"
                    : "text-slate-300 hover:text-white")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone utilisateur (Clerk) */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium hover:bg-emerald-500">
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
