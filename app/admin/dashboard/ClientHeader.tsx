"use client";
import { UserButton } from "@clerk/nextjs";

export default function ClientHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Portfolio Admin</h2>
        <UserButton afterSignOutUrl="/admin/login" />
      </div>
    </header>
  );
}
