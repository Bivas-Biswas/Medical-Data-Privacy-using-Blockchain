const User = artifacts.require("User");
const Provider = artifacts.require("Provider");

module.exports = async function (deployer) {
  // await deployer.deploy(MedicalReport);
  await deployer.deploy(User);
  await deployer.deploy(Provider);
};

// command:
//  truffle dashboard
//  truffle migrate --network dashboard