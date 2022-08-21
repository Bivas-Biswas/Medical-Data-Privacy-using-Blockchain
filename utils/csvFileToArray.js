export const csvFileToArray = (string) => {
  const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
  const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
  const array = csvRows.map((i) => {
    const values = i.split(",");
    const obj = csvHeader.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
    return obj;
  });
  return array;
};


//
// In Machine Learning field the problem is "how to get the accurate data?" like in medical field we have the more accurate and more improvement in healthcare.
//
//   The	user	would have	full	access	to	his	data	and	control over how	his	data	would be shared.		The
// user	would assign	a	set	of	access	permissions	and	designate	who	can	query	and	write	data	to
// his	blockchain.		A	dashboard	application	would	allow	the	user	to	see	who	has
// permission	to	access	his blockchain.		The	user	would	also	be	able	to	view	an	audit	log	of	who
// accessed	his	blockchain,	including	when	and	what	data	was	accessed.		The	same	dashboard
// would	allow	the	user	to	give	and	revoke	access	permissions	to	any	individual	who	has	a	unique
// identifier.
//
//   So we make this project resolved this problem.
//
//
// <img src="https://user-images.githubusercontent.com/75929842/185799415-d4c0f420-0fd8-4c84-8b83-6713057fc5e4.png  " width="50%" />
//
//
// I created a web dashboard for uploading and accessing the medical reports.
//
//   I divide it into two category users -
//
// 1. **User:**
// - can upload medical reports as csv
// - give read access to individual reports to individual providers.
// - revoke read access from individual reports from individual providers
// - <img src="https://user-images.githubusercontent.com/75929842/185800066-f7a65f22-a5ba-49f8-9854-0b9ca7ab1150.png" width="50%" />
// - <img src="https://user-images.githubusercontent.com/75929842/185799822-2e0ee90e-f777-44c6-8fc2-ae055c311427.png" width="50%" />
//
//
// 2. **Provider:**
// - Provider can verify reports with the report address.
// - Can view and download the report.
// - Can check which user revoke access for which report.
// - Store all reports.
//
//   Firstly Before I had never written a single line of solidity code.
//
//   Some Problems I ran into:
//   - new to Solidity
// - how to interconnect the whole system.
// - not able to make good API in solidity.
// - didn't know about truffle.
// - where to host.
// - config metamask.
//
//   All problems are solved now. Big shout to google and me.
//
//
//
//   Yes or No
//
//
//   Member # 1
// Name: Bivas Biswas
// Email: bbivas307@gmail.com
// Twitter handle (hyperlinked): [@bivasbiswas99](https://twitter.com/bivasbiswas99)
//
//
// User Medical Data Access Security and Data Privacy using Blockchain.
//
//   bbivas307@gmail.com
//
// https://github.com/Bivas-Biswas/Medical-Data-Privacy-using-Blockchain
//
// https://medical-data-privacy-using-blockchain.vercel.app/
//
//   https://drive.google.com/drive/folders/1Sq2-z4L-8tRxCIRg1_WK3nlRItBDtD0a?usp=sharing