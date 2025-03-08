import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" />
      <main className="container mx-auto py-6">
        <Outlet />
      </main>
    </div>
  );
}
