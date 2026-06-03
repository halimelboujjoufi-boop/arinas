import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EC] px-6 py-12 flex items-center justify-center">
      <LoginForm />
    </main>
  );
}

