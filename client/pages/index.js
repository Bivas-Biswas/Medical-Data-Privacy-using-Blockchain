import { ProviderContractAddress, UserContractAddress } from "../config.js"; // contract address
import ProviderAbi from "../../backend/build/contracts/Provider.json"; // ABI
import UserAbi from "../../backend/build/contracts/User.json"; // ABI
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useLoginContext } from "../context";
import Button from "../components/Button";

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useLoginContext();

  const addReport = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const UserContract = new ethers.Contract(
          UserContractAddress,
          UserAbi.abi,
          signer
        );
        console.log(UserContract);

        const x = await UserContract._addMedicalReport("Task2");
        console.log(x);

        // setTasks(allTasks)
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const giveAccess = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const UserContract = new ethers.Contract(
          UserContractAddress,
          UserAbi.abi,
          signer
        );
        console.log(UserContract);

        const x = await UserContract._giveAccess(
          1,
          "0x23Ce7C3202F496F893c258CB4d8D418502091dd7"
        );
        console.log(x);
        // setTasks(allTasks)
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProviderDetails = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const ProviderContract = new ethers.Contract(
          ProviderContractAddress,
          ProviderAbi.abi,
          signer
        );
        console.log(ProviderContract);

        const x = await ProviderContract._getDetails(
          "0xd816a2c204E4f6150B97B98c182a77d3Ae5168f0"
        );
        console.log(x);
        // setTasks(allTasks)
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
