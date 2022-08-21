import React from "react";
import Button from "./Button";
import { useLoginContext } from "../context";
import { initialUser } from "../context/provider/Login";
import { useRouter } from "next/router";
import Link from "./Link";

function Navbar() {
  const { isUserLoggedIn, setIsUserLoggedIn, setUser } = useLoginContext();
  const router = useRouter();

  return (
    <nav className="flex flex-row py-4 items-center justify-between px-2">
      <Link href={"/"}>
        <h1 className="text-2xl font-medium">Title</h1>
      </Link>
      {isUserLoggedIn && (
        <div
          onClick={() => {
            setIsUserLoggedIn(false);
            setUser(initialUser);
            router.push('/')
          }}
        >
          <Button>Logout</Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
