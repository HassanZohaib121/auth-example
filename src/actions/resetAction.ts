"use server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";

function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function sendOtp({ email }: { email?: string }) {
  try {
    if (!email) {
      throw new Error("Email is required");
    }
    if (email) {
      const password = generateRandomSixDigitNumber().toString();
      console.log(password);
      const hashedPassword = await hash(password, 10);
      const resetData = await prisma.user.update({
        where: { email },
        data: {
          forgetPassword: hashedPassword,
        },
      });
      return { success: true, data: resetData.email };
    }
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}

export async function checkotp(email: string, otp: string) {
  if (email && otp) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { forgetPassword: true },
    });

    if (!user || !user.forgetPassword) {
      throw new Error("Invalid reset attempt");
    }
    const isCorrectOTP = await compare(otp.toString(), user.forgetPassword); // Added await here
    return { success: isCorrectOTP };
  }
}

export async function resetPassword(
  email: string,
  password: { password: string }
) {
  const hashedPassword = await hash(password.password, 10);
  const userData = await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });
  await createSession(userData.id.toString());
  redirect("/dashboard");
}
