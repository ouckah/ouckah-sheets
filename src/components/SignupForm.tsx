"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    reenterPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (formData.password !== formData.reenterPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement backend integration
    // This is where you would typically make an API call to create a new user
    console.log("Form submitted:", formData);

    // Simulating a successful signup
    toast({
      title: "Success",
      description: "Your account has been created. Please log in.",
    });

    // TODO: Redirect to login page or dashboard after successful signup
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google authentication
    // This is where you would typically initiate the Google OAuth flow
    console.log("Google signup initiated");
  };

  return (
    <Card className="w-[400px] px-6">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reenterPassword">Re-enter Password</Label>
            <Input
              id="reenterPassword"
              name="reenterPassword"
              type="password"
              required
              value={formData.reenterPassword}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
        >
          Sign up with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
