import { auth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import DashboardNav from './nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      {children}
    </div>
  );
}