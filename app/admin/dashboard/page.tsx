import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientHeader from "./ClientHeader";

export default async function AdminDashboard() {
  const user = await currentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader /> {/* Pass user as prop if needed */}
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-xl text-gray-600">Welcome back, {user.fullName}!</p>
      </main>
    </div>
  );
}
