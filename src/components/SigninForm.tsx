"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { signIn, getSession } from "next-auth/react";

export default function SigninForm() {
  const handleSignin = async () => {
    const userSession = await handleGoogleSignin();
    if (userSession) {
      await handleUserSignin();
    }
  };
  const handleUserSignin = async () => {
    const session = await getSession();
      if (!session?.user?.email) {
        console.error("No user email found in session");
        return;
      } else if (!session?.user?.name) {
        console.error("No user name found in session");
        return;
      }

      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          username: session.user.name,
        }),
      });
      if (!response.ok) {
        console.error("Failed to check or create user:", await response.json());
        toast({
          title: "Error",
          description: "Failed to check user status.",
          variant: "destructive",
        });
      }
  }

  const handleGoogleSignin = async () => {
    try {
      const result = await signIn("google", { redirect: false });
  
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to sign in with Google.",
          variant: "destructive",
        });
        return null;
      }
  
      // wait for session to update
      const session = await getSession();
      return session;
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return null;
    }
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
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignin}
        >
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
