import { Inter } from "next/font/google";
import { Button } from "@/components/button";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-24 gap-4 md:flex-row">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button variant="quiet">Quiet</Button>
      <Button variant="bare">Bare</Button>
    </div>
  );
}
