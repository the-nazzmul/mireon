import Image from "next/image";
import { Button } from "./ui/button";
import { ThemeToggler } from "./theme-toggler";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

const Navbar = async () => {
  const { userId } = await auth();
  return (
    <nav className="sticky top-0 w-full bg-transparent backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between p-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/mireon-logo.png" alt="logo" height={40} width={40} />
          <h1 className="text-3xl font-bold uppercase text-primary">Mireon</h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button>
            <Link href="/dashboard">
              {userId ? "Dashboard" : "Get Started"}
            </Link>
          </Button>
          <ThemeToggler />
          {userId && (
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: "h-[34px] w-[34px]" },
              }}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
