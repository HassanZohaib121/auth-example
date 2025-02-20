"use server";
import { FormState, loginSchema, SignupFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { compare, hash } from "bcryptjs";
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

  if (!user?.password) {
    return { error: "Please enter Password" };
  }

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
  deleteSession();
  redirect("/login");
}
