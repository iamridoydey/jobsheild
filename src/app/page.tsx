"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Github, Search, AlertCircle, UserPlus } from "lucide-react";
import Image from "next/image";
import { useAuthPopup } from "@/hooks/authPopup";
import AuthPopupHandler from "@/components/auth/AuthPopupHandler";
import { useSession, signOut } from "next-auth/react";

const Home = () => {
  const { setAuthPopup } = useAuthPopup();
  const { data: session } = useSession();
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // Redirect to home page after sign out
  };

  return (
    <div className="min-h-screen bg-gray-900 w-full">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-sm w-full">
        <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Placeholder for Logo */}
            <div className="h-10 w-10 rounded-full flex items-center justify-center">
              <Image
                src={"/jobsheild_logo.svg"}
                alt={"Jobsheild logo"}
                className="text-gray-300"
                width={32}
                height={32}
              />
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-100">
              JobShield
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserPopupOpen(!isUserPopupOpen)}
                  className="focus:outline-none"
                >
                  <figure>
                    <Image
                      width={32}
                      height={32}
                      src={"/user_avatar.svg"}
                      alt="User Avatar"
                    />
                  </figure>
                </button>
                {/* User Popup */}
                {isUserPopupOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthPopup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Show auth popup */}
      <AuthPopupHandler />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-100 mb-6">
          Protect Yourself from Job Scams
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          JobShield helps you identify and avoid fraudulent companies and
          spammers. Join our community to share and access verified information.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/fraud_companies"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Explore Fraud Companies
          </Link>
          <Link
            href="/add_fraud_company"
            className="bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition"
          >
            Add New Fraud Company
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-12">
          Why Choose JobShield?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <Search className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Search Fraud Companies
            </h3>
            <p className="text-gray-300">
              Easily search and verify companies to avoid scams.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Report Fraudulent Activity
            </h3>
            <p className="text-gray-300">
              Share your experiences to help others stay safe.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <UserPlus className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Join the Community
            </h3>
            <p className="text-gray-300">
              Connect with others to fight against job scams.
            </p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join JobShield today and help create a safer job market for
            everyone.
          </p>
          <Link
            href="/fraud_companies"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold">JobShield</span>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} JobShield. All rights reserved.
            </p>
          </div>
          <div>
            <a
              href="https://github.com/iamridoydey/jobsheild"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
