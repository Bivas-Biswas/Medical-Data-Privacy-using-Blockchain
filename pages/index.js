import { useRouter } from "next/router";
import { useLoginContext } from "../context";
import Button from "../components/Misc/Button";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useLoginContext();

  useEffect(() => {
    if (user.address && user.type) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="flex flex-col mt-32 items-center gap-10">
      <p className="text-3xl font-semibold">Login as a</p>
      <div className="flex flex-row justify-center gap-4 items-center">
        <Button
          onClick={() => {
            router.push("/login");
            setUser({ ...user, type: "user" });
          }}
          className={"!bg-red-500 hover:scale-105 text-2xl px-12"}
        >
          User
        </Button>
        <Button
          onClick={() => {
            router.push("/login");
            setUser({ ...user, type: "provider" });
          }}
          className={"!bg-yellow-500 hover:scale-105 text-2xl px-10"}
        >
          Provider
        </Button>
      </div>
    </div>
  );
}
