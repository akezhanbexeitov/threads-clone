import { UserButton } from "@clerk/nextjs";

export default function MainPage() {
  return (
    <main>
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
