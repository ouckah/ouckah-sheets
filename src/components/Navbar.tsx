"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Ouckah Sheets
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/sheets"
                className={`${
                  pathname === "/sheets"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Sheets
              </Link>
              <Link
                href="/interviews"
                className={`${
                  pathname === "/interviews"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Interviews
              </Link>
              <Link
                href="/explore"
                className={`${
                  pathname === "/explore"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Explore
              </Link>
              <Link
                href="/profile"
                className={`${
                  pathname === "/profile"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
            <Link href="/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

