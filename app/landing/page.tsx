import React from "react";
import Link from "next/link";
import {
  FolderIcon,
  ChartBarIcon,
  LockIcon,
  UserIcon,
  CreditCardIcon,
  TrendingUpIcon,
  LucideIcon,
} from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:shadow-blue-900/20 dark:hover:shadow-blue-800/30 border border-transparent dark:border-gray-700'>
    <div className='flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30'>
      <Icon className='w-6 h-6 text-blue-600 dark:text-blue-400' />
    </div>
    <h3 className='text-xl font-semibold mb-2 dark:text-white'>{title}</h3>
    <p className='text-gray-600 dark:text-gray-300'>{description}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 py-16'>
        <nav className='flex justify-between items-center mb-16 animate-fade-in'>
          <div className='flex items-center space-x-2'>
            <FolderIcon className='h-8 w-8 text-blue-600 dark:text-blue-400 animate-bounce' />
            <span className='text-2xl font-bold dark:text-white'>
              Budget Buddy
            </span>
          </div>
          <div className='space-x-4'>
            <Link href='/sign-in'>
              <button className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'>
                Sign In
              </button>
            </Link>
            <Link href='/sign-up'>
              <button className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transform transition-transform duration-200 hover:scale-105'>
                Get Started
              </button>
            </Link>
          </div>
        </nav>

        <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
          <div className='lg:w-1/2 space-y-6 animate-slide-up'>
            <h1 className='text-5xl font-bold leading-tight dark:text-white'>
              Take Control of Your
              <span className='text-blue-600 dark:text-blue-400'>
                {" "}
                Financial Future
              </span>
            </h1>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-lg'>
              Smart budgeting, intuitive expense tracking, and intelligent
              insights to help you achieve your financial goals.
            </p>
            <div className='space-x-4 pt-4'>
              <Link href='/sign-up'>
                <button className='bg-blue-600 dark:bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                  Start Free Trial
                </button>
              </Link>
              <Link href='/sign-in'>
                <button className='bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transform transition-all duration-200 hover:scale-105'>
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          <div className='lg:w-1/2 relative animate-slide-up'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 animate-pulse'></div>
            <div className='relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl dark:shadow-blue-900/30'>
              <div className='grid grid-cols-2 gap-4'>
                <img
                  src='budget-buddy-logo.svg'
                  alt='Budget Buddy Logo'
                  className='col-span-2'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='bg-gray-50 dark:bg-gray-900 py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 dark:text-white'>
            Why Choose Budget Buddy?
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <FeatureCard
              icon={ChartBarIcon}
              title='Smart Analytics'
              description='Get detailed insights into your spending patterns with interactive charts and reports.'
            />
            <FeatureCard
              icon={LockIcon}
              title='Bank-Level Security'
              description='Your financial data is protected with enterprise-grade encryption and security measures.'
            />
            <FeatureCard
              icon={UserIcon}
              title='Personalized Experience'
              description='Tailored budgeting recommendations based on your unique spending habits.'
            />
            <FeatureCard
              icon={CreditCardIcon}
              title='Expense Tracking'
              description='Automatically categorize and track all your expenses in real-time.'
            />
            <FeatureCard
              icon={TrendingUpIcon}
              title='Goal Setting'
              description='Set and track financial goals with practical milestone tracking.'
            />
            <FeatureCard
              icon={FolderIcon}
              title='Easy Organization'
              description='Keep all your financial documents and records organized in one place.'
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='container mx-auto px-4 py-16 text-center'>
        <h2 className='text-3xl font-bold mb-4 dark:text-white'>
          Ready to Start Your Financial Journey?
        </h2>
        <p className='text-gray-600 dark:text-gray-300 mb-8'>
          Join thousands of users who have transformed their financial lives
          with Budget Buddy.
        </p>
        <Link href='/sign-up'>
          <button className='bg-blue-600 dark:bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 hover:shadow-lg dark:shadow-blue-900/30'>
            Get Started Now
          </button>
        </Link>
      </div>
    </div>
  );
}
