import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4">
      <main className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-indigo-600">Ouckah Sheets</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
          Organize your job search, track applications, and stay on top of your career opportunities.
        </p>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
          <div className="rounded-md shadow">
            <Link href="/sheets">
              <Button className="w-full px-8 py-3 text-base font-medium">My Sheets</Button>
            </Link>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Link href="/explore">
              <Button variant="outline" className="w-full px-8 py-3 text-base font-medium">
                Explore
              </Button>
            </Link>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Link href="/profile">
              <Button variant="outline" className="w-full px-8 py-3 text-base font-medium">
                My Profile
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

