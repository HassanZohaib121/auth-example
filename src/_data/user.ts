import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { cache } from "react";

interface Session {
  userId?: string;
}

export const getUser = cache(async () => {
  const session = await verifySession();

  const id = (await session).userId;

  if (id!) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true },
    });
    return user;
  }
});
