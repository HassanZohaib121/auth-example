import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await verifySession();
    if(!session){
        redirect("/login")
    }
  return (
      <main className=" place-content-center">
        {children}
      </main>
  );
}
