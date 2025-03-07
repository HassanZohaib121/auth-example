'use client'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useActionState } from "react";
import { signup } from "@/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [state, action] = useActionState(signup, undefined)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <UserPlus className="h-10 w-10" />
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p className="text-muted-foreground">
            Enter your name, email and password to sign up.
          </p>
        </div>
        <Card>
          <form action={action}>
            <CardContent className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name"  type="text" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email"  type="email" placeholder="name@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password"  type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div>
              <Link
                href="/login"
                className="text-sm text-muted-foreground"
                prefetch={false}
              >
                Login
              </Link>
              <Link
                href="/recover-password"
                className="text-sm text-muted-foreground"
                prefetch={false}
              >
                Forgot password?
              </Link>
              <Button type="submit">Sign up</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}