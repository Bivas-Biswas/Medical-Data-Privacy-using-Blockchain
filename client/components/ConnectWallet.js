import React from "react";
import Button from "./Button";

const ConnectWalletButton = ({ connectWallet }) => (
  <Button
    className="h-[5rem] text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg"
    onClick={connectWallet}
  >
    Connect Wallet
  </Button>
);

export default ConnectWalletButton;
