"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FolderIcon,
  ChartBarIcon,
  LockIcon,
  UserIcon,
  CreditCardIcon,
  TrendingUpIcon,
  LucideIcon,
  Menu,
  X,
  Check,
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

const PricingModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full p-6 sm:p-8 relative animate-fade-in'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
          <X className='h-6 w-6' />
        </button>

        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold mb-4 dark:text-white'>
            Choose Your Plan
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Start your journey to better financial health today
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Free Trial Plan */}
          <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-2 border-blue-500'>
            <h3 className='text-2xl font-bold mb-4 dark:text-white'>
              7-Day Free Trial
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>
              Try all premium features risk-free
            </p>
            <ul className='space-y-3 mb-6'>
              <li className='flex items-center text-gray-600 dark:text-gray-300'>
                <Check className='h-5 w-5 text-green-500 mr-2' />
                Full access to all features
              </li>
              <li className='flex items-center text-gray-600 dark:text-gray-300'>
                <Check className='h-5 w-5 text-green-500 mr-2' />
                No credit card required
              </li>
              <li className='flex items-center text-gray-600 dark:text-gray-300'>
                <Check className='h-5 w-5 text-green-500 mr-2' />
                Cancel anytime
              </li>
            </ul>
            <Link href='/sign-up'>
              <button className='w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform transition-all duration-200 hover:scale-105'>
                Start Free Trial
              </button>
            </Link>
          </div>

          {/* Premium Plan */}
          <div className='bg-blue-600 dark:bg-blue-700 rounded-xl p-6 text-white'>
            <h3 className='text-2xl font-bold mb-4'>Premium Plan</h3>
            <div className='mb-4'>
              <span className='text-4xl font-bold'>$9.99</span>
              <span className='text-blue-100'>/month</span>
            </div>
            <ul className='space-y-3 mb-6'>
              <li className='flex items-center'>
                <Check className='h-5 w-5 text-blue-200 mr-2' />
                Advanced analytics and insights
              </li>
              <li className='flex items-center'>
                <Check className='h-5 w-5 text-blue-200 mr-2' />
                Custom budget categories
              </li>
              <li className='flex items-center'>
                <Check className='h-5 w-5 text-blue-200 mr-2' />
                Priority customer support
              </li>
              <li className='flex items-center'>
                <Check className='h-5 w-5 text-blue-200 mr-2' />
                Export financial reports
              </li>
            </ul>
            <Link href='/sign-up'>
              <button className='w-full bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transform transition-all duration-200 hover:scale-105'>
                Get Premium
              </button>
            </Link>
          </div>
        </div>

        <div className='mt-8 text-center'>
          <h4 className='text-xl font-semibold mb-4 dark:text-white'>
            Why Choose Budget Buddy?
          </h4>
          <div className='grid sm:grid-cols-3 gap-4 text-sm'>
            <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <h5 className='font-semibold mb-2 dark:text-white'>
                Smart Analytics
              </h5>
              <p className='text-gray-600 dark:text-gray-300'>
                AI-powered insights to optimize your spending
              </p>
            </div>
            <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <h5 className='font-semibold mb-2 dark:text-white'>
                Bank-Level Security
              </h5>
              <p className='text-gray-600 dark:text-gray-300'>
                Your data is protected with enterprise-grade encryption
              </p>
            </div>
            <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <h5 className='font-semibold mb-2 dark:text-white'>
                24/7 Support
              </h5>
              <p className='text-gray-600 dark:text-gray-300'>
                Get help whenever you need it
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 py-8 sm:py-16'>
        {/* Mobile Navigation */}
        <nav className='flex justify-between items-center mb-8 sm:mb-16 animate-fade-in'>
          <div className='flex items-center space-x-2'>
            <FolderIcon className='h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 animate-bounce' />
            <span className='text-xl sm:text-2xl font-bold dark:text-white'>
              Budget Buddy
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden sm:flex space-x-4'>
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

          {/* Mobile Menu Button */}
          <button
            className='sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className='h-6 w-6 text-gray-600 dark:text-gray-300' />
            ) : (
              <Menu className='h-6 w-6 text-gray-600 dark:text-gray-300' />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='sm:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900'>
            <div className='flex flex-col h-full'>
              <div className='flex justify-between items-center p-4 border-b dark:border-gray-800'>
                <div className='flex items-center space-x-2'>
                  <FolderIcon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                  <span className='text-xl font-bold dark:text-white'>
                    Budget Buddy
                  </span>
                </div>
                <button
                  className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                  onClick={() => setIsMenuOpen(false)}>
                  <X className='h-6 w-6 text-gray-600 dark:text-gray-300' />
                </button>
              </div>
              <div className='flex flex-col p-4 space-y-4'>
                <Link href='/sign-in'>
                  <button className='w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'>
                    Sign In
                  </button>
                </Link>
                <Link href='/sign-up'>
                  <button className='w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'>
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className='flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12'>
          <div className='lg:w-1/2 space-y-4 sm:space-y-6 animate-slide-up text-center lg:text-left'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight dark:text-white'>
              Take Control of Your
              <span className='text-blue-600 dark:text-blue-400'>
                {" "}
                Financial Future
              </span>
            </h1>
            <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0'>
              Smart budgeting, intuitive expense tracking, and intelligent
              insights to help you achieve your financial goals.
            </p>
            <div className='flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4'>
              <Link href='/sign-up' className='w-full sm:w-auto'>
                <button className='w-full sm:w-auto bg-blue-600 dark:bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                  Start Free Trial
                </button>
              </Link>
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className='w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transform transition-all duration-200 hover:scale-105'>
                Learn More
              </button>
            </div>
          </div>

          <div className='lg:w-1/2 relative animate-slide-up w-full max-w-md mx-auto'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 animate-pulse'></div>
            <div className='relative bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-xl dark:shadow-blue-900/30'>
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
      <div className='bg-gray-50 dark:bg-gray-900 py-12 sm:py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 dark:text-white'>
            Why Choose Budget Buddy?
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8'>
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
      <div className='container mx-auto px-4 py-12 sm:py-16 text-center'>
        <h2 className='text-2xl sm:text-3xl font-bold mb-4 dark:text-white'>
          Ready to Start Your Financial Journey?
        </h2>
        <p className='text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
          Join thousands of users who have transformed their financial lives
          with Budget Buddy.
        </p>
        <Link href='/sign-up'>
          <button className='w-full sm:w-auto bg-blue-600 dark:bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 hover:shadow-lg dark:shadow-blue-900/30'>
            Get Started Now
          </button>
        </Link>
      </div>

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
