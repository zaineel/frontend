import { SignUp } from "@clerk/nextjs";
import { FolderIcon } from "lucide-react";

export default function Page() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
      <div className='mb-8 flex items-center'>
        <FolderIcon className='h-10 w-10 text-blue-600' />
        <span className='ml-2 text-2xl font-bold'>BudgetBuddy</span>
      </div>
      <SignUp fallbackRedirectUrl='/dashboard' forceRedirectUrl='/dashboard' />
    </div>
  );
}
