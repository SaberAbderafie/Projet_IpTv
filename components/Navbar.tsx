// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mainLinks = [ 
  { href: "/", label: "Accueil" },
  { href: "/plans", label: "Plans" },
  { href: "/mes-abonnements", label: "Mes abonnements" },
  { href: "/historique", label: "Historique" },
];

const adminLinks = [
  { href: "/admin/plans", label: "Admin Plans" },
  { href: "/admin/paiements", label: "Admin Paiements" },
];

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded-md text-sm transition-colors ${
        isActive
          ? "bg-emerald-600 text-orange-400"
          : "text-orange-400 hover:bg-slate-800 hover:text-orange-400"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo / titre */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-sm font-bold">
            VV
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-white">VivaVistaTV</div>
            <div className="text-[11px] text-slate-400">
              IPTV • Codes d&apos;activation instantanés
            </div>
          </div>
        </Link>

        {/* Liens */}
        <nav className="flex-1 flex items-center justify-between gap-4">
          <div className="flex gap-1">
            {mainLinks.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {adminLinks.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}

            {/* Lien profil / Clerk */}
            <Link
              href="/profil"
              className="ml-2 px-3 py-1 rounded-full text-xs border border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-white"
            >
              Mon profil
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
