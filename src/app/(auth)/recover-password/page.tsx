'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyIcon } from "lucide-react";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { checkotp, sendOtp, resetPassword } from "@/actions/resetAction";

export default function PasswordResetPage() {
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailData, setEmailData] = useState('');

  const EmailForm = (
    <Card>
      <form action={async (formData) => {
        try {
          const userData = {
            email: formData.get("email") as string,
          };
          const result = await sendOtp(userData);
          if (result) {
            setEmailData(result.data);
            setSubmitted(result.success);
          }
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }}>
        <CardContent className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Send Reset Code</Button>
        </CardFooter>
      </form>
    </Card>
  );

  const OTPForm = (
    <Card>
      <form action={async (formData) => {
        try {
          const otp = formData.get("otp")!.toString();
          const result = await checkotp(emailData, otp);
          if (result?.success) {
            setSubmitted(false);
            setSuccess(result?.success || false);
          }
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }}>
        <CardContent className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label>Enter verification code</Label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} name="otp">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Verify Code</Button>
        </CardFooter>
      </form>
    </Card>
  );

  const NewPasswordForm = (
    <Card>
      <form action={async (formData) => {
        try {
          const userPassword = {
            password: formData.get("password") as string,
          };
          const result = await resetPassword(emailData, userPassword);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }}>
        <CardContent className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter your new password" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Reset Password</Button>
        </CardFooter>
      </form>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <KeyIcon className="h-10 w-10" />
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-muted-foreground">
            {!submitted && !success && "Enter your email to receive a reset code."}
            {submitted && "Enter the verification code sent to your email."}
            {success && "Create your new password."}
          </p>
        </div>
        {!submitted && !success && EmailForm}
        {submitted && OTPForm}
        {success && NewPasswordForm}
      </div>
    </div>
  );
}