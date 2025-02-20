'use client'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon } from "lucide-react";
import { useActionState } from "react";
import { login } from "@/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [state, loginAction] = useActionState(login, undefined);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <CloudIcon className="h-10 w-10" />
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground">
            Enter your email and password to sign in.
          </p>
        </div>
        <Card>
          <form action={loginAction}>
            <CardContent className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email"  type="email" placeholder="name@example.com" />
                {state?.errors?.email && (<p className="text-red-500">{state.errors.email}</p>)}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password"  type="password" />
                {state?.errors?.password && (<p className="text-red-500">{state.errors.password}</p>)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div>
              <Link
                href="/signup"
                className="text-sm text-muted-foreground"
                prefetch={false}
              >
                Signup
              </Link>
              <Link
                href="/recover-password"
                className="text-sm text-muted-foreground"
                prefetch={false}
              >
                Forgot password?
              </Link>
              <Button type="submit">Log in</Button>
              {/* <Button formAction={login}>Log in</Button> */}
              {/* <Button formAction={signup}>Sign up</Button> */}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}