export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className=" place-content-center">
        {children}
      </main>
  );
}
