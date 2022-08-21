import { useRouter } from "next/router";
import { useLoginContext } from "../context";
import Button from "../components/Button";

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useLoginContext();
  return (
    <div className="flex flex-col gap-4 items-center mt-32">
      <Button
        onClick={() => {
          router.push("/login");
          setUser({ ...user, type: "user" });
        }}
        className={"!bg-red-500 hover:scale-105"}
      >
        Join As User
      </Button>
      <Button
        onClick={() => {
          router.push("/login");
          setUser({ ...user, type: "provider" });
        }}
        className={"!bg-yellow-500 hover:scale-105"}
      >
        Join As Provider
      </Button>
    </div>
  );
}
