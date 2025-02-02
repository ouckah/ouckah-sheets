"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2 } from "lucide-react";

type ProfileData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  location: string;
  bio: string;
  linkedIn: string;
  github: string;
  sheetVisibility: boolean;
  experiences: Array<{ title: string; company: string; duration: string }>;
  education: Array<{ degree: string; institution: string; year: string }>;
};

const initialProfile: ProfileData = {
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  profilePicture: "/placeholder.svg?height=100&width=100",
  location: "New York, NY",
  bio: "Passionate software developer with 5 years of experience.",
  linkedIn: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  sheetVisibility: false,
  experiences: [
    {
      title: "Software Engineer",
      company: "Tech Corp",
      duration: "2020 - Present",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "University of Technology",
      year: "2020",
    },
  ],
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProfile((prev) => ({ ...prev, sheetVisibility: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated profile to your backend
    console.log("Updated profile:", profile);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { title: "", company: "", duration: "" },
      ],
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={profile.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <Label htmlFor="profilePicture" className="cursor-pointer">
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                    <span className="text-sm text-blue-600 hover:underline">
                      Change Profile Picture
                    </span>
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    name="linkedIn"
                    type="url"
                    value={profile.linkedIn}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    name="github"
                    type="url"
                    value={profile.github}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sheet Settings</CardTitle>
              <CardDescription>
                Manage your sheet visibility and other settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sheetVisibility">Make my sheet public</Label>
                <Switch
                  id="sheetVisibility"
                  checked={profile.sheetVisibility}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experience & Education</CardTitle>
              <CardDescription>
                Add your work experience and education details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Work Experience</h3>
                {profile.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="space-y-2 border-b pb-4 last:border-b-0"
                  >
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(index, "title", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Duration (e.g., 2020 - Present)"
                      value={exp.duration}
                      onChange={(e) =>
                        updateExperience(index, "duration", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExperience}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Education</h3>
                {profile.education.map((edu, index) => (
                  <div
                    key={index}
                    className="space-y-2 border-b pb-4 last:border-b-0"
                  >
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) =>
                        updateEducation(index, "year", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducation}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
}
