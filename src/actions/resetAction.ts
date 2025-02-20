"use server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function sendOtp({ email }: { email?: string }) {
  try {
    if (!email) {
      throw new Error("Email is required");
    }
    if (email) {
      const OTP = generateRandomSixDigitNumber().toString();
      console.log(OTP);
      const hashedOTP = await hash(OTP, 10);
      const resetData = await prisma.user.update({
        where: { email },
        data: {
          forgetPassword: hashedOTP,
        },
      });
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true", // true for port 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Send email
      // await transporter.sendMail({
      //   from: process.env.SMTP_FROM,
      //   to: email,
      //   subject: "Password Reset OTP",
      //   text: `Your OTP for password reset is: ${OTP}`,
      //   html: `<p>Your OTP for password reset is: <strong>${OTP}</strong></p>`,
      // });
      await transporter.sendMail({
        from: `"Hassan Zohaib" <${process.env.SMTP_FROM}>`, // Add a sender name for professionalism
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${OTP}`, // Fallback for email clients that don't support HTML
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #4CAF50;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Use the OTP below to proceed:</p>
            <p style="font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">${OTP}</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <br>
            <p style="color: #777;">Regards,<br>Auth Example Team</p>
        </div>
        `,
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
