import React, { useState } from "react";
import { useLoginContext } from "../context";
import Button from "./Button";
import { ethers } from "ethers";
import { UserContractAddress } from "../config";
import UserAbi from "../backend/build/contracts/User.json";
import { b64_to_json, formatBytes, json_to_b64, textTruncate } from "../utils";
import AnimatedModal from "./AnimateModal";
import Loading from "./Loading";
import cx from "classnames";
import CsvView from "./CsvView";
import { useDropzone } from "react-dropzone";
import { FileTextIcon } from "@radix-ui/react-icons";
import Input from "./Input";
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
    toast.error("Something went wrong!");
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

const User = () => {
  const fileReader = new FileReader();
  const { user } = useLoginContext();
  const [report, setReport] = useState(null);
  const [addProvider, setAddProvider] = useState(null);
  const [removeProvider, setRemoveProvider] = useState(null);
  const [file, setFile] = useState(null);
  const [allReport, setAllReport] = useState([]);
  const [selectReport, setSelectReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { getRootProps, getInputProps, open, isDragAccept, isDragReject } =
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
      console.log(providers);
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

  return (
    <div className={""}>
      <p>Hello</p>
      <h1>Welcome back</h1>
      <p>{user.address}</p>
      {report && <CsvView csvInText={report} />}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div
            className={cx(
              `rounded h-[7rem] justify-center py-4 flex flex-col items-center max-w-[20rem] bg-blue-100 border-dashed border-2 border-gray-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-tranfrom duration-150 ease-in-out`,
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
            onClick={() => addReport(json_to_b64(report))}
            className="bg-yellow-500 p-4 w-min"
          >
            Save
          </Button>
        </div>
        <div className={"flex flex-col gap-4 w-full"}>
          <div>
            <Button
              onClick={async () => {
                const reports = await getAllDetails();
                setAllReport(reports);
              }}
            >
              Fetch All Your Reports
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
                    className="px-6 py-3 text-left text-lg uppercase tracking-wider font-bold"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg uppercase tracking-wider font-bold"
                  >
                    Report Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg uppercase tracking-wider font-bold"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 overflow-auto flex-1 rounded-b-xl">
                {allReport.map((report, idx) => {
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
                          <div className="text-lg text-content-medium font-semibold">
                            {report[1]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center align-middle w-full pl-6">
                          <div className="text-lg text-content-medium font-semibold">
                            <Button onClick={() => showReportDetails(idx)}>
                              Opts
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                  <div className="flex flex-row gap-4">
                    <p>Id: </p>
                    <p>{selectReport.id}</p>
                  </div>
                  <div className="flex flex-row gap-4">
                    <p>Address: </p>
                    <p>{selectReport.address}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>Providers: </p>
                    <table
                      className={
                        "divide-y divide-gray-500 rounded flex flex-col max-h-[30vh] items-stretch bg-gray-700"
                      }
                    >
                      <thead className={"rounded-t-xl"}>
                        <tr className="flex justify-between border border-blue-900">
                          <th
                            scope="col"
                            className="px-6 py-3 text-left uppercase tracking-wider font-bold"
                          >
                            SL.
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left uppercase tracking-wider font-bold"
                          >
                            Provider Address
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left uppercase tracking-wider font-bold"
                          >
                            Permission
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700 overflow-auto flex-1 rounded-b-xl">
                        {selectReport.providers.map((pro, idx) => {
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
                                  <div className="text-lg text-content-medium font-semibold">
                                    {pro[0]}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-center items-center align-middle w-full pl-6">
                                  <div className="text-lg text-content-medium font-semibold">
                                    {pro[1] ? "True" : "False"}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p>Details: </p>
                    <CsvView csvInText={b64_to_json(selectReport.details)} />
                  </div>
                  <div className="flex flex-col gap-4">
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
                  <div className="flex flex-col gap-4">
                    <Input
                      id={"remove-provider"}
                      label={"Remove Provider:"}
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
                        Remove
                      </Button>
                      <Button
                        className={"w-min px-6"}
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
