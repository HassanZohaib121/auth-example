"use server";
import { FormState, SignupFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields

  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const validatedFields = SignupFormSchema.safeParse({
    name,
    email,
    password,
  });

  // const { name, email, password } = validatedFields.data!;

  // e.g. Hash the user's password before storing it
  const hashedPassword = await hash(password, 10);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the provider or db to create a user...
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  await createSession(user.id.toString());
  // 5. Redirect user
  redirect("/dashboard");
}

export async function logout() {
  deleteSession();
  redirect("/login");
}
