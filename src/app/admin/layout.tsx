// app/admin/layout.tsx
import { Header } from "@/components/header";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <Header />
      </header>
      {children}
    </ClerkProvider>
  );
}
