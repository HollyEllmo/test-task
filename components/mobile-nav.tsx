"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "./auth/logout-button";
import { Button } from "./ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const user = useCurrentUser();

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/auth/register")}
                    href="/auth/register"
                    className="flex items-center w-full font-semibold text-green-600"
                  >
                    Get started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/auth/login")}
                    href="/auth/login"
                    className="flex items-center w-full font-semibold"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/dashboard")}
                    href="/news"
                    className="flex items-center w-full font-semibold"
                  >
                    News
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/settings")}
                    href="/settings"
                    className="flex items-center w-full font-semibold"
                  >
                    Settings
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                {user?.role !== "USER" && (
                  <li>
                    <Link
                      onClick={() => closeOnCurrent("/createNews")}
                      href="/createNews"
                      className="flex items-center w-full font-semibold"
                    >
                      Create News
                    </Link>
                  </li>
                )}
                <li className="my-3 h-px w-full bg-gray-300" />
                {user?.role === "ADMIN" && (
                  <li>
                    <Link
                      onClick={() => closeOnCurrent("/users")}
                      href="/users"
                      className="flex items-center w-full font-semibold"
                    >
                      Users
                    </Link>
                  </li>
                )}
                <li className="my-3 h-px w-full bg-gray-300" />
                {user?.role === "ADMIN" && (
                  <li>
                    <Link
                      onClick={() => closeOnCurrent("/createUser")}
                      href="/createUser"
                      className="flex items-center w-full font-semibold"
                    >
                      Create User
                    </Link>
                  </li>
                )}
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <LogoutButton>
                    <div className="flex items-center w-full font-semibold">
                      Sign out
                    </div>
                  </LogoutButton>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
