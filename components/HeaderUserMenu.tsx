"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function HeaderUserMenu() {
  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <SignInButton>
          <button className="px-3 py-1 rounded bg-emerald-900 hover:bg-emerald-400 text-sm">
            Se connecter
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
