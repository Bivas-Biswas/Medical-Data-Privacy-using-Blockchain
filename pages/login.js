import React, { useCallback, useEffect, useState } from "react";
import ConnectWalletButton from "../components/Misc/ConnectWallet";
import { useLoginContext } from "../context";
import { useRouter } from "next/router";
import Button from "../components/Misc/Button";
import Link from "../components/Misc/Link";
import toast from "react-hot-toast";
import { initialUser } from "../context/provider/Login";

const Login = () => {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const { isUserLoggedIn, setIsUserLoggedIn, user, setUser } =
    useLoginContext();
  const router = useRouter();

  const navigate = useCallback(
    (_route) => {
      return router.push(_route);
    },
    [router]
  );

  useEffect(() => {
    if (user.address && user.type) {
      navigate("/dashboard");
    }
  }, [navigate, user.address, user.type]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });

      // Making sure your wallet is connected to Rinkeby. See line 150 and 182 to see what happens with this state
      const rinkebyChainId = "0x4";

      if (chainId !== rinkebyChainId) {
        setCorrectNetwork(true);
        return;
      } else {
        setCorrectNetwork(false);
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setUser({
        address: accounts[0],
        type: user.type,
      });
      setIsUserLoggedIn(true);
      await navigate(`/dashboard`);
      toast.success("Logged in");
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  if (isUserLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center py-6 items-center gap-10">
      {!user.type ? (
        <div>
          <p className="text-3xl font-semibold text-center">Login as</p>
          <div className="flex flex-row justify-center gap-4 items-center mt-8">
            <Button
              onClick={() => {
                setUser({ ...user, type: "user" });
              }}
              className={"!bg-red-500 hover:scale-105 text-2xl px-12"}
            >
              User
            </Button>
            <Button
              onClick={() => {
                setUser({ ...user, type: "provider" });
              }}
              className={"!bg-yellow-500 hover:scale-105 text-2xl px-10"}
            >
              Provider
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center py-6 items-center gap-10">
          <Button onClick={() => setUser(initialUser)} className="!py-1">Back</Button>
          <p className="text-center text-3xl font-medium underline">
            Select logging method as a {user.type}
          </p>
          {correctNetwork && <WrongNetworkMessage />}
          {user.type && !correctNetwork && !isUserLoggedIn && (
            <ConnectWalletButton connectWallet={connectWallet} />
          )}
        </div>
      )}
    </div>
  );
};

export default Login;

const WrongNetworkMessage = () => (
  <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
    {/* Prompt to change network to Rinkeby */}
    <div>----------------------------------------</div>
    <div>Please connect to the Rinkeby Testnet</div>
    <div>and reload the page</div>
    <div>----------------------------------------</div>
    <Link href="/" className="text-sm">
      <Button>Go Back</Button>
    </Link>
  </div>
);
