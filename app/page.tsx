import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-400 to-green-400">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          👀
        </h1>

        <div className="flex flex-col">
          <p className="text-3xl font-bold mt-10 text-center sm:mt-4 text-zinc-700">
            Hello, this is a test task for Vadim Galkin
          </p>
          <p className="text-xl mt-5 text-center sm:mt-2 text-zinc-600">
            Please sign in if you have not already done so
          </p>
        </div>
      </div>
    </main>
  );
}
