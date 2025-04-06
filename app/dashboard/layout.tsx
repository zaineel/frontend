import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardNav from "./nav";
import DashboardSidebar from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900'>
      <DashboardNav />
      <div className='flex flex-1 h-[calc(100vh-4rem)] overflow-hidden'>
        <DashboardSidebar />
        <main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
