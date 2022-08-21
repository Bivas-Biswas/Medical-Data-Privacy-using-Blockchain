import React from "react";
import Button from "../Misc/Button";
import { useLoginContext } from "../../context";
import { initialUser } from "../../context/provider/Login";
import Link from "../Misc/Link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

function Navbar() {
  const { isUserLoggedIn, setIsUserLoggedIn, setUser, user } =
    useLoginContext();

  return (
    <nav className="sticky top-0 bg-blue-200 py-4 px-2 shadow-lg mb-10">
      <div className="flex flex-row items-center justify-between w-full max-w-6xl mx-auto">
        <Link
          href={user.address && user.type ? "/dashboard" : "/"}
          className="flex flex-row gap-2 items-center justify-between"
        >
          <Image src="/favicon.jpg" alt="logo" width={40} height={40} />
          <h1 className="text-3xl font-medium">MeDiDataBlock</h1>
        </Link>
        <div className="flex flex-row gap-4 items-center justify-between">
          {isUserLoggedIn && (
            <Link
              href={"/"}
              onClick={() => {
                setIsUserLoggedIn(false);
                setUser(initialUser);
              }}
            >
              <Button>Logout</Button>
            </Link>
          )}
          <a
            href="https://github.com/Bivas-Biswas/Medical-Data-Privacy-using-Blockchain"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:scale-[1.09]"
          >
            <GitHubLogoIcon className="w-10 h-10" />
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
