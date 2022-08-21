import React, { useState } from "react";
import ConnectWalletButton from "../components/ConnectWallet";
import { useLoginContext } from "../context";
import { useRouter } from "next/router";
import Button from "../components/Button";
import Link from "../components/Link";
import toast from "react-hot-toast";

function Login() {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const { isUserLoggedIn, setIsUserLoggedIn, user, setUser } =
    useLoginContext();
  const router = useRouter();

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
      router.push(`/dashboard`);
      toast.success("Logged in");
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  return (
    <div className="bg-[#97b5fe] flex flex-col justify-center py-6 items-center gap-10">
      <p className="text-center text-3xl font-medium underline">login as a {user.type}</p>
      {correctNetwork && <WrongNetworkMessage />}
      {!correctNetwork && !isUserLoggedIn && (
        <ConnectWalletButton connectWallet={connectWallet} />
      )}
    </div>
  );
}

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
