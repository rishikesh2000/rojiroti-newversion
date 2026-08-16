import { Outlet, Navigate } from "react-router-dom";
import { EmployerSidebar } from "@/components/employer/EmployerSidebar";
import { EmployerHeader } from "@/components/employer/EmployerHeader";
import { useState } from "react";
import { getSession } from "@/lib/session";

export default function EmployerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = getSession();

  // Redirect non-employers
  if (session && session.role !== "employer") {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect unauthenticated users
  if (!session) {
    return <Navigate to="/employer-login" replace />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <EmployerHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
      
      <div className="flex min-w-0 flex-1 overflow-hidden">
        <EmployerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
