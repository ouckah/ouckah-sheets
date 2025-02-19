"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, FileSpreadsheet, Calendar } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

type ProfileData = {
  email: string,
  name: string
  firstName: string
  lastName: string
  pfp: string
  location: string
  bio: string
  linkedin: string
  github: string
  sheetVisibility: boolean
  interviewsVisibility: boolean
  experiences: Array<{ title: string; company: string; duration: string }>
  education: Array<{ degree: string; institution: string; year: string }>
}

type PublicProfileProps = {
  userId: string
}

export default function PublicProfile({ userId }: PublicProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const session = useSession()
  const isOwnProfile = session && profile?.email === session?.data?.user?.email

  const fetchUserProfile = async (userId: string): Promise<ProfileData> => {
    const request = await fetch(`/api/user/getById/${userId}`);
    const data = await request.json();
    const profile = data.user;

    return profile;
  }

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      const data = await fetchUserProfile(userId)
      setProfile(data)
      setIsLoading(false)
    }

    loadProfile()
  }, [userId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.pfp} alt={`${profile.firstName} ${profile.lastName}`} />
                <AvatarFallback>
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle>
                  {profile.firstName} {profile.lastName}
                </CardTitle>
                <CardDescription>{profile.location}</CardDescription>
              </div>
              {isOwnProfile && (
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4 text-center">{profile.bio}</p>
            <div className="flex justify-center space-x-4 mb-4">
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </a>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {profile.sheetVisibility && (
                <Link href={`/sheets/${userId}`}>
                  <Button variant="outline" className="w-full">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    View Sheets
                  </Button>
                </Link>
              )}
              {profile.interviewsVisibility && (
                <Link href={`/interviews/${userId}`}>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Interviews
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.experiences.map((exp, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-gray-500">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.duration}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.education.map((edu, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-gray-500">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

