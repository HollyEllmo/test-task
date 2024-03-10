"use client";

import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { Button } from "./ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname } from "next/navigation";
import { UserButton } from "./auth/user-button";
import { LoginButton } from "@/components/auth/login-button";
import { ArrowRight } from "lucide-react";

import MobileNav from "./mobile-nav";

const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/55 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Home</span>
          </Link>

          <MobileNav isAuth={!!user} />

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              {user && (
                <Button
                  asChild
                  variant={pathname === "/settings" ? "default" : "outline"}
                >
                  <Link href="/settings">Settings</Link>
                </Button>
              )}

              {user && (
                <Button
                  asChild
                  variant={pathname === "/news" ? "default" : "outline"}
                >
                  <Link href="/news">News</Link>
                </Button>
              )}

              {user?.role !== "USER" && (
                <Button
                  asChild
                  variant={pathname === "/createNews" ? "default" : "outline"}
                >
                  <Link href="/createNews">Create News</Link>
                </Button>
              )}
              {user?.role === "ADMIN" && (
                <Button
                  asChild
                  variant={pathname === "/createUser" ? "default" : "outline"}
                >
                  <Link href="/createUser">Create User</Link>
                </Button>
              )}
              {user?.role === "ADMIN" && (
                <Button
                  asChild
                  variant={pathname === "/users" ? "default" : "outline"}
                >
                  <Link href="/users">Users</Link>
                </Button>
              )}

              {user && <UserButton />}
              {!user && (
                <LoginButton asChild>
                  <Button variant={"default"}>
                    Sign in <ArrowRight className="ml-1.5 h-5 w-5" />
                  </Button>
                </LoginButton>
              )}
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
