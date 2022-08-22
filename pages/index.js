import { useRouter } from "next/router";
import { useLoginContext } from "../context";
import Button from "../components/Misc/Button";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user } = useLoginContext();

  useEffect(() => {
    if (user.type) {
      router.push("/login");
    }
  }, []);

  if (user.type) {
    return null;
  }

  return (
    <div className="flex flex-col mt-24 items-center gap-10">
      <div>
        <p className="animate-charcter text-center text-3xl font-semibold">
          One stop solution of your precious <br /> Medical Data.
        </p>
        <p className="text-center mt-5 text-lg">
          Access and Data Privacy using Blockchain
        </p>
      </div>
      <div className="flex flex-row justify-center gap-4 items-center">
        <Button
          onClick={() => {
            router.push("/login");
          }}
          className={"!bg-violet-600 hover:scale-105 text-2xl px-12"}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
