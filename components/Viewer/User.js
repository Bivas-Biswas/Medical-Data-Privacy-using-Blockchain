import React, { useState } from "react";
import { useLoginContext } from "../../context";
import Button from "../Misc/Button";
import { ethers } from "ethers";
import { UserContractAddress } from "../../config";
import UserAbi from "../../backend/build/contracts/User.json";
import {
  b64_to_json,
  copyToClip,
  formatBytes,
  json_to_b64,
  textTruncate,
} from "../../utils";
import AnimatedModal from "../Misc/AnimateModal";
import Loading from "../Layout/Loading";
import cx from "classnames";
import CsvView from "../Misc/CsvView";
import { useDropzone } from "react-dropzone";
import {
  CheckCircledIcon,
  Component1Icon,
  CrossCircledIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import Input from "../Inputs/Input";
import toast from "react-hot-toast";

const connectWithContact = () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const UserContract = new ethers.Contract(
      UserContractAddress,
      UserAbi.abi,
      signer
    );
    return UserContract;
  } else {
    return null;
  }
};

const addReport = async (report) => {
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      await contract._addMedicalReport(report);
    }
  } catch (error) {
    toast.error("Something went wrong!");
  }
};

const getAllDetails = async () => {
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      const reports = await contract._allMedicalReport();
      return reports;
    }
  } catch (error) {
    toast.error("You have no reports!");
  }
};

const getAllProvider = async (id) => {
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      const providers = await contract._allProvider(id);
      return providers;
    }
  } catch (error) {
    toast.error("Something went wrong!");
  }
};

const assignProvider = async (id, account) => {
  if (!account) {
    return toast.error("Add provider address!");
  }
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      await contract._giveAccess(id, account);
      toast.success(account + "added successfully.");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong!");
  }
};

const revokeProvider = async (id, account) => {
  if (!account) {
    return toast.error("Add provider address!");
  }
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      await contract._revokeAccess(id, account);
      toast.success(account + "removed successfully.");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong!");
  }
};

const sampleCSV = `first_name,last_name,email,gender,age,zip,registered
Constantin,Langsdon,clangsdon0@hc360.com,Male,96,123,true
Norah,Raison,nraison1@wired.com,Female,32,false
`;

const User = () => {
  const fileReader = new FileReader();
  const { user, isUserLoggedIn } = useLoginContext();
  const [report, setReport] = useState(null);
  const [addProvider, setAddProvider] = useState(null);
  const [removeProvider, setRemoveProvider] = useState(null);
  const [file, setFile] = useState(null);
  const [allReport, setAllReport] = useState([]);
  const [selectReport, setSelectReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      maxFiles: 1,
      // noClick: true,
      noKeyboard: true,
      accept: {
        "text/csv": [],
      },
      onDropAccepted: (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
          acceptedFiles.forEach((file) => {
            fileReader.onload = function (event) {
              const csvOutput = event.target.result;
              setReport(csvOutput);
            };
            setFile(file);
            fileReader.readAsText(file);
          });
        }
      },
    });

  const showReportDetails = async (id) => {
    try {
      setIsReportModalOpen(true);
      const providers = await getAllProvider(id);
      const report = allReport[id];
      setSelectReport({
        id,
        details: report[0],
        address: report[1],
        providers,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDownloadSampleFile = () => {
    const blob = new Blob([sampleCSV], {
      type: "text/csv",
    });
    saveAs(blob, `sample.csv`);
  };

  return (
    <div className={"flex flex-col gap-4"}>
      <p className="text-center my-4 text-xl">
        Hello Welcome back <br /> <b>{user.address}</b>
      </p>
      {isUserLoggedIn && user.type === "user" && (
        <Button className="w-max" onClick={handleDownloadSampleFile}>
          Download Sample Csv
        </Button>
      )}
      {report && <CsvView csvInText={report} className="!bg-blue-200" />}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 w-full items-center">
          <div
            className={cx(
              `w-full rounded h-[7rem] justify-center py-4 flex flex-col items-center bg-blue-100 border-dashed border-2 border-gray-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-tranfrom duration-150 ease-in-out`,
              {
                "border-red-300 bg-red-50": isDragReject,
                "border-green-300 bg-green-50": isDragAccept,
              }
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            <div>
              {file ? (
                <div className="flex">
                  <div className="flex gap-2 py-1 items-center rounded">
                    <FileTextIcon className="h-9 w-9" />
                    <div className="flex flex-col">
                      <p className="whitespace-nowrap">
                        {textTruncate(file.name, 20, 10)}
                      </p>
                      <p className="text-xs text-gray-700">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xl text-center">
                  Drag and drop files here <br />
                  or Click
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={async () => {
              if (!report || !file) {
                return toast.error("No reported add!");
              }
              await addReport(json_to_b64(report));
              setReport(null);
              setFile(null);
            }}
            className="bg-yellow-500 px-10 text-xl w-min"
          >
            Save
          </Button>
        </div>
        <div className={"flex flex-col gap-4 w-full"}>
          <div>
            <Button
              className="text-xl w-max"
              onClick={async () => {
                const reports = await getAllDetails();
                setAllReport(reports);
              }}
            >
              Fetch All Reports
            </Button>
          </div>
          <div className="overflow-auto">
            <table
              className={
                "divide-y divide-gray-500 rounded flex flex-col max-h-[60vh] items-stretch w-full"
              }
            >
              <thead className={"rounded-t-xl"}>
                <tr className="flex justify-between border border-blue-900">
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-lg uppercase tracking-wider font-bold"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-lg uppercase tracking-wider font-bold"
                  >
                    Report Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-lg uppercase tracking-wider font-bold"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 overflow-auto flex-1 rounded-b-xl">
                {allReport &&
                  allReport.map((report, idx) => {
                    return (
                      <tr
                        key={idx}
                        className="flex justify-between bg-elevation-4 rounded-b-xl"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center align-middle w-full pl-6">
                            <div className="text-lg text-content-medium font-semibold">
                              {idx}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center align-middle w-full pl-6">
                            <div
                              className="text-lg text-content-medium font-semibold"
                              onClick={() => copyToClip(report[1])}
                            >
                              {report[1]}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center align-middle w-full pl-6">
                            <div className="text-lg text-content-medium font-semibold">
                              <Button
                                className={
                                  "bg-gray-500 hover:bg-green-500 hover:scale-100"
                                }
                                onClick={() => showReportDetails(idx)}
                              >
                                <Component1Icon />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {allReport && allReport.length === 0 && (
              <p className="text-xl my-5 text-center text-red-500">
                {" "}
                Fetch All Reports
              </p>
            )}
            {!allReport && (
              <p className="text-xl my-5 text-center text-red-500">
                {" "}
                You have no Reports!
              </p>
            )}
          </div>
          <AnimatedModal
            isOpen={isReportModalOpen}
            className={cx(!selectReport && "bg-transparent shadow-none")}
            onClose={() => {
              setIsReportModalOpen(false);
              setSelectReport(null);
            }}
          >
            <div className="w-[70vw] p-8 flex flex-col justify-center">
              {selectReport ? (
                <div className="w-full h-full flex flex-col gap-2">
                  <div className="flex flex-row gap-4 items-center">
                    <p className="text-lg font-semibold">Id: </p>
                    <p>{selectReport.id}</p>
                  </div>
                  <div className="flex flex-row gap-4  items-center">
                    <p className="text-lg font-semibold">Address: </p>
                    <p>{selectReport.address}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold">Providers: </p>
                    {selectReport.providers.length === 0 ? (
                      <p className="text-red-500">*No providers added</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table
                          className={
                            "divide-y divide-gray-500 min-w-max w-full rounded flex flex-col max-h-[30vh] items-stretch bg-gray-700"
                          }
                        >
                          <thead className={"rounded-t-xl"}>
                            <tr className="flex justify-between border border-blue-900">
                              <th
                                scope="col"
                                className="px-6 py-3 text-center uppercase tracking-wider font-bold"
                              >
                                SL.
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center uppercase tracking-wider font-bold"
                              >
                                Provider Address
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center uppercase tracking-wider font-bold"
                              >
                                Permission
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700 flex-1 rounded-b-xl">
                            {selectReport.providers.map((pro, idx) => {
                              return (
                                <tr
                                  key={idx}
                                  className="flex justify-between rounded-b-xl"
                                >
                                  <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="">
                                      <div className="text-lg font-semibold">
                                        {idx}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="">
                                      <div
                                        className="text-lg font-semibold"
                                        onClick={() => copyToClip(pro[0])}
                                      >
                                        {pro[0]}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex justify-center items-center align-middle w-full">
                                      <div className="">
                                        {pro[1] ? (
                                          <CheckCircledIcon className="w-8 h-8 text-green-500" />
                                        ) : (
                                          <CrossCircledIcon className="w-8 h-8 text-red-500" />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-lg font-semibold">Details: </p>
                    <div className="w-full">
                      <CsvView csvInText={b64_to_json(selectReport.details)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-4">
                    <Input
                      id={"add-provider"}
                      label={"Add Provider:"}
                      value={addProvider || ""}
                      textSize={"large"}
                      placeholder={"add provider..."}
                      onChangeValue={(_value) => setAddProvider(_value)}
                    />
                    <div className="flex flex-row justify-between">
                      <Button
                        className={"w-min px-6"}
                        onClick={() => {
                          assignProvider(selectReport.id, addProvider).then(
                            () => setAddProvider("")
                          );
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-4">
                    <Input
                      id={"remove-provider"}
                      label={"Revoke Provider:"}
                      value={removeProvider || ""}
                      textSize={"large"}
                      placeholder={"add provider..."}
                      onChangeValue={(_value) => setRemoveProvider(_value)}
                    />
                    <div className="flex flex-row justify-between">
                      <Button
                        className={"w-min px-6"}
                        onClick={() => {
                          revokeProvider(selectReport.id, removeProvider).then(
                            () => setRemoveProvider("")
                          );
                        }}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-row w-full mt-7">
                    <Button
                      className={
                        "w-full px-3 py-2 text-xl font-semibold bg-blue-800"
                      }
                      type={"secondary"}
                      onClick={async () => {
                        const reports = await getAllDetails();
                        setAllReport(reports);
                        await showReportDetails(selectReport.id);
                      }}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              ) : (
                <Loading centerParent />
              )}
            </div>
          </AnimatedModal>
        </div>
      </div>
    </div>
  );
};

export default User;
