import React, { useEffect } from "react";
import User from "../components/User";
import { useRouter } from "next/router";
import { useLoginContext } from "../context";
import Provider from "../components/Provider";

const Dashboard = () => {
  const { isUserLoggedIn, user } = useLoginContext();
  const router = useRouter();
  useEffect(() => {
    if (!isUserLoggedIn) {
      router.push("/");
    }
  }, []);

  if (!isUserLoggedIn) {
    return null;
  }
  if (user.type === "user") {
    return <User />;
  }
  if (user.type === "provider") return <Provider />;
};

export default Dashboard;
