import { csvFileToArray } from "../../utils";
import cx from "classnames";

const CsvView = ({ csvInText, className = "" }) => {
  const array = csvFileToArray(csvInText);

  const headerKeys = Object.keys(Object.assign({}, ...array));
  return (
    <div className="overflow-x-auto w-full">
      <table className={cx("divide-y divide-gray-700 text-center  w-full border-b border-gray-700", className)}>
        <thead className={""}>
          <tr key={"header"} className="font-bold border border-gray-700">
            {headerKeys.map((key, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-2"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700">
          {array.map((item, index) => (
            <tr key={index} className="">
              {Object.values(item).map((val, index) => (
                <td className="px-3 py-1" key={index}>
                  {val ? val : "-"}
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
