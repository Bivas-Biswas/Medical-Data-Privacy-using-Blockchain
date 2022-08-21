import React, { useState } from "react";
import { useLoginContext } from "../context";
import { ethers } from "ethers";
import { ProviderContractAddress } from "../config";
import ProviderAbi from "../backend/build/contracts/Provider.json";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import CsvView from "./CsvView";
import { b64_to_json } from "../utils";
import cx from "classnames";
import Loading from "./Loading";
import AnimatedModal from "./AnimateModal";
import { saveAs } from "file-saver";
import { Component1Icon } from "@radix-ui/react-icons";

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
      const haveAccess = await contract._getDetails(reportId);
      if (haveAccess) {
        return haveAccess;
      } else {
        toast.error('You don"t have premission to see this ');
        return null;
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

  return (
    <div>
      <p>
        Hello Welcome back <br /> <b>{user.address}</b>
      </p>
      <div className="flex flex-col gap-3">
        {report && (
          <CsvView csvInText={b64_to_json(report)} className="bg-gray-100" />
        )}
        <div className="flex flex-col gap-2">
          <Input
            id={"verify-report"}
            label={"Verify Report:"}
            labelClassName={"text-black"}
            value={reportId || ""}
            textSize={"large"}
            placeholder={"add provider..."}
            onChangeValue={(_value) => setReportId(_value)}
          />
          <Button
            className="w-min"
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
            className="w-max"
            onClick={async () => {
              const reports = await getAllReports();
              setAllReports(reports);
            }}
          >
            Fetch All Your Reports
          </Button>

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
                <div className="flex flex-col gap-4">
                  <CsvView
                    csvInText={b64_to_json(selectReport.reportTxt)}
                    className=""
                  />
                  <Button className="w-min" onClick={handleDownloadFile}>
                    Download
                  </Button>
                </div>
              ) : (
                <Loading centerParent />
              )}
            </div>
          </AnimatedModal>

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
                    Permission
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
                {allReports.map((report, idx) => {
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
                            {report[0]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center align-middle w-full pl-6">
                          <div className="text-lg text-content-medium font-semibold">
                            {report[1] ? "True" : "False"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center align-middle w-full pl-6">
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
