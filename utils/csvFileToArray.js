export const csvFileToArray = (string) => {
  const csvHeader = string.slice(0, string.indexOf("\n")).split(";");
  const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
  const array = csvRows.map((i) => {
    const values = i.split(";");
    const obj = csvHeader.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
    return obj;
  });
  return array;
};
