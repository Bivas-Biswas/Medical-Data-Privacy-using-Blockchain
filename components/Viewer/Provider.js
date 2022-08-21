import React, { useEffect, useState } from "react";
import { useLoginContext } from "../../context";
import { ethers } from "ethers";
import { ProviderContractAddress } from "../../config";
import ProviderAbi from "../../backend/build/contracts/Provider.json";
import Input from "../Inputs/Input";
import Button from "../Misc/Button";
import toast from "react-hot-toast";
import CsvView from "../Misc/CsvView";
import { b64_to_json, copyToClip } from "../../utils";
import cx from "classnames";
import Loading from "../Layout/Loading";
import AnimatedModal from "../Misc/AnimateModal";
import { saveAs } from "file-saver";
import {
  CheckCircledIcon,
  Component1Icon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";

const connectWithContact = () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const ProviderContract = new ethers.Contract(
      ProviderContractAddress,
      ProviderAbi.abi,
      signer
    );
    return ProviderContract;
  } else {
    return null;
  }
};

const handleVerifyReport = async (reportId) => {
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      try {
        await contract._verifyDetail(reportId);
        const haveAccess = await contract._getDetails(reportId);
        console.log(haveAccess);
        if (haveAccess) {
          return haveAccess;
        } else {
          toast.error('You don"t have premission to see this');
          return null;
        }
      } catch (e) {
        toast.error("Something went wrong!");
      }
    }
  } catch (error) {
    toast.error("Something went wrong!");
  }
};

const getAllReports = async () => {
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      const allReport = await contract._allhaveAccess();
      return allReport;
    }
  } catch (error) {
    toast.error("Something went wrong!");
  }
};

const showReportDetails = async (_reportId) => {
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      const report = await contract._getDetails(_reportId);
      return report;
    }
  } catch (error) {
    toast.error("Something went wrong!");
  }
};

const removeReportDetails = async (_reportId) => {
  try {
    const contract = connectWithContact();
    if (!contract) {
      console.log("Ethereum object doesn't exist");
    } else {
      try {
        await contract._removeReport(_reportId);
        toast.success("successfull deleted.");
      } catch (e) {
        toast.error("not authorized / report does not exist!");
      }
    }
  } catch (error) {
    toast.error("Something went wrong!");
  }
};

function Provider() {
  const { user } = useLoginContext();
  const [reportId, setReportId] = useState();
  const [report, setReport] = useState();
  const [allReports, setAllReports] = useState([]);
  const [selectReport, setSelectReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleDownloadFile = () => {
    const blob = new Blob([b64_to_json(selectReport.reportTxt)], {
      type: "text/csv",
    });
    saveAs(blob, `${selectReport.address}.csv`);
  };

  const hadleShowDetails = async (report) => {
    try {
      if (report[1]) {
        const re = await showReportDetails(report[0]);
        setSelectReport({
          address: report[0],
          reportTxt: re,
        });
        setIsReportModalOpen(true);
      } else {
        setIsReportModalOpen(false);
        toast.error("Verify first!");
      }
    } catch (e) {
      setIsReportModalOpen(false);
      toast.error("something wrong happend!");
    }
  };

  const handleRemoveAccessReport = async () => {
    console.log(selectReport.address);
    await removeReportDetails(selectReport.address);
    setIsReportModalOpen(false);
  };

  return (
    <div>
      <p className="text-center my-4 text-xl">
        Hello Welcome back <br /> <b>{user.address}</b>
      </p>
      <div className="flex flex-col gap-3">
        {report && (
          <CsvView csvInText={b64_to_json(report)} className="!bg-blue-200" />
        )}
        <div className="flex flex-col gap-2">
          <Input
            id={"verify-report"}
            label={"Verify Report:"}
            labelClassName={"text-black text-xl"}
            className="bg-gray-600"
            value={reportId || ""}
            textSize={"large"}
            placeholder={"add provider..."}
            onChangeValue={(_value) => setReportId(_value)}
          />
          <Button
            className="w-min px-8"
            onClick={async () => {
              const detail = await handleVerifyReport(reportId);
              setReport(detail);
            }}
          >
            Verify
          </Button>
        </div>
        <p className="text-base font-medium text-red-500">
          *first you have to verify the report
        </p>
        <div className="flex flex-col gap-2">
          <Button
            type={"secondary"}
            className="text-xl w-max"
            onClick={async () => {
              const reports = await getAllReports();
              setAllReports(reports);
            }}
          >
            Fetch All Reports
          </Button>

          <AnimatedModal
            isOpen={isReportModalOpen}
            className={cx(!selectReport && "bg-transparent shadow-none")}
            onClose={() => {
              setIsReportModalOpen(false);
              setSelectReport(null);
            }}
          >
            <div className="max-w-[70vw] p-8 flex flex-col justify-center">
              {selectReport ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4 items-center">
                    <p className="text-lg font-semibold">Address:</p>
                    <p>{selectReport.address}</p>
                  </div>
                  <CsvView csvInText={b64_to_json(selectReport.reportTxt)} />
                  <div className="flex flex-row gap-4">
                    <Button
                      className="text-xl mt-4"
                      type={"secondary"}
                      onClick={handleRemoveAccessReport}
                    >
                      Delete
                    </Button>
                    <Button
                      className="text-xl mt-4"
                      onClick={handleDownloadFile}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <Loading centerParent />
              )}
            </div>
          </AnimatedModal>

          <div className="overflow-x-auto">
            <table
              className={
                "divide-y divide-gray-500 rounded flex flex-col max-h-[60vh] min-w-full w-max items-stretch"
              }
            >
              <thead className={"rounded-t-xl"}>
                <tr className="flex w-full border border-blue-900">
                  <th
                    scope="col"
                    className="px-6 w-1/12 py-3 text-center text-lg uppercase tracking-wider font-bold"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-7/12 py-3 text-center text-lg uppercase tracking-wider font-bold"
                  >
                    Report Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-2/12 py-3 text-center text-lg uppercase tracking-wider font-bold"
                  >
                    Permission
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-2/12 py-3 col-start-10 col-end-12 col-span-4 text-center text-lg uppercase tracking-wider font-bold"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 overflow-auto flex-1 rounded-b-xl">
                {allReports.map((report, idx) => {
                  return (
                    <tr key={idx} className="flex w-full rounded-b-xl">
                      <td className="w-1/12 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center align-middle w-full">
                          <div className="text-lg text-center font-semibold">
                            {idx}
                          </div>
                        </div>
                      </td>
                      <td className="w-7/12 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center align-middle w-fulls">
                          <div
                            className="text-lg text-content-medium font-semibold"
                            onClick={() => copyToClip(report[1])}
                          >
                            {report[0]}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 w-2/12 whitespace-nowrap">
                        <div className="flex justify-center items-center w-full">
                          <div className="text-lg text-content-medium font-semibold">
                            {report[1] ? (
                              <CheckCircledIcon className="w-8 h-8 text-green-500" />
                            ) : (
                              <CrossCircledIcon className="w-8 h-8 text-red-500" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="w-2/12 px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center align-middle w-full">
                          <div className="text-lg text-content-medium font-semibold">
                            <Button
                              className={"bg-gray-500"}
                              onClick={() => hadleShowDetails(report)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Provider;
