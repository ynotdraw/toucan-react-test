import { Inter } from "next/font/google";
import { Button } from "@/components/button";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // TODO: Need theme switcher
  //       - Need to add style="color-scheme: dark;" to <html>
  //       - Need to add `theme-dark` / `theme-light` to <body>
  // TODO: theme-light / theme-dark needs to go on the body instead (see above)
  // Probably want something similar to https://github.com/tailwindlabs/tailwindcss.com/blob/dff1b6211acb2286b4094b992ac145211734400d/src/pages/_document.js#L35
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
