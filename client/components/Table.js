import React from "react";
import Button from "./Button";

function Table(props) {
  return (
    <div>
      <table
        className={
          "divide-y divide-gray-500 rounded flex flex-col max-h-[80vh] items-stretch"
        }
      >
        <thead className={"rounded-t-xl"}>
          <tr className="flex justify-between border border-blue-900">
            <th
              scope="col"
              className="px-6 py-3 text-left text-lg uppercase tracking-wider font-bold"
            >
              SL.
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-lg uppercase tracking-wider font-bold"
            >
              Provider Address
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-lg uppercase tracking-wider font-bold"
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
                      {pro[1]}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
