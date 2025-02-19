"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FormState } from "@/lib/definitions";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: FormState, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
    // select: { id: true, name: true, email: true },
  });

  const correctPassword = await compare(password, user!.password);

  if (!correctPassword || !user) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  if (correctPassword) {
    await createSession(user?.id);
    redirect("/dashboard");
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
