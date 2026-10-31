import Link from "next/link";

// Placeholder until US-01 replaces this route with the real Submit ticket screen (S1).
export default function Home() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">HelpDesk AI</h1>
      <p className="text-muted-foreground">
        The app is being built. The clickable low-fidelity prototypes are available now.
      </p>
      <p>
        <Link className="font-medium underline underline-offset-4" href="/prototype">
          Open the prototypes
        </Link>
      </p>
    </main>
  );
}
