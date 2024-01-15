export const metadata = {
  title: "Threads Clone",
  description: "Threads Clone created by Akezhan Bexeitov",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
