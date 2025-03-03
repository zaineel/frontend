// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { FolderIcon } from "lucide-react";

export default function Page() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
      <div className='mb-8 flex items-center'>
        <FolderIcon className='h-10 w-10 text-blue-600' />
        <span className='ml-2 text-2xl font-bold'>BudgetBuddy</span>
      </div>
      <SignIn
        fallbackRedirectUrl='https://budgetbuddy.zaineelmithani.com/dashboard'
        forceRedirectUrl='https://budgetbuddy.zaineelmithani.com/dashboard'
      />
    </div>
  );
}
