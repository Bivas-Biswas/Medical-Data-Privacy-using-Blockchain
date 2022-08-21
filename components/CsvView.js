import { csvFileToArray } from "../utils";
import cx from "classnames";

const CsvView = ({ csvInText, className = "" }) => {
  const array = csvFileToArray(csvInText);

  const headerKeys = Object.keys(Object.assign({}, ...array));
  return (
    <div className="overflow-x-auto">
      <table
        className={cx(
          "divide-y divide-gray-500 rounded flex flex-col max-h-[80vh] w-max bg-gray-900",
          className
        )}
      >
        <thead className={"rounded-t-xl"}>
          <tr
            key={"header"}
            className="flex justify-between border border-blue-900"
          >
            {headerKeys.map((key, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-lg uppercase tracking-wider font-bold"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700 flex-1 rounded-b-xl">
          {array.map((item, index) => (
            <tr
              key={index}
              className="flex justify-between bg-elevation-4 rounded-b-xl"
            >
              {Object.values(item).map((val, index) => (
                <td className="px-6 py-4 whitespace-nowrap" key={index}>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvView;
