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

export default function SigninForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement backend integration
    // This is where you would typically make an API call to authenticate the user
    console.log("Form submitted:", formData);

    // Simulating a successful signin
    toast({
      title: "Success",
      description: "You have successfully signed in.",
    });

    // TODO: Redirect to dashboard after successful signin
  };

  const handleGoogleSignin = () => {
    // TODO: Implement Google authentication
    // This is where you would typically initiate the Google OAuth flow
    console.log("Google signin initiated");
  };

  return (
    <Card className="w-[400px] px-6">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignin}
        >
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
