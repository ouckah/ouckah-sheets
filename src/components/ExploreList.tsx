"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type PublicUser = {
  id: string
  name: string
  jobCount: number
  lastUpdated: string
}

const dummyUsers: PublicUser[] = [
  { id: "user1", name: "Alice Johnson", jobCount: 5, lastUpdated: "2025-01-30" },
  { id: "user2", name: "Bob Smith", jobCount: 3, lastUpdated: "2025-01-28" },
  { id: "user3", name: "Charlie Brown", jobCount: 7, lastUpdated: "2025-01-29" },
  { id: "user4", name: "Diana Prince", jobCount: 2, lastUpdated: "2025-01-27" },
  { id: "user5", name: "Ethan Hunt", jobCount: 4, lastUpdated: "2025-01-26" },
]

export default function ExploreList() {
  const [searchTerm, setSearchTerm] = useState("")
  const users = dummyUsers // const [users, setUsers] = useState<PublicUser[]>(dummyUsers)

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Explore Public Sheets</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Sheet Entries</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/sheets/${user.id}`} className="font-medium text-blue-600 hover:underline">
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.jobCount}</TableCell>
                <TableCell>{new Date(user.lastUpdated).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

