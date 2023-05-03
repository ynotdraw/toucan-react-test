import { Inter } from "next/font/google";
import { Button } from "@/components/button";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // TODO: Need theme switcher
  // TODO: theme-light / theme-dark needs to go on the body instead
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 theme-light">
      <div className="flex flex-col gap-4 md:flex-row">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
        <Button variant="quiet">Quiet</Button>
        <Button variant="bare">Bare</Button>
      </div>
    </main>
  );
}
