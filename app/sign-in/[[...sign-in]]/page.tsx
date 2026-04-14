import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
      <SignIn />
    </main>
  );
}
