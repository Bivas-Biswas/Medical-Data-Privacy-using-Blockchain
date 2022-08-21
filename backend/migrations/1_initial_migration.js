const User = artifacts.require("User");
const MedicalReport = artifacts.require("MedicalReport");
const Provider = artifacts.require("Provider");

module.exports = async function (deployer) {
  // await deployer.deploy(MedicalReport);
  await deployer.deploy(User);
  await deployer.deploy(Provider);
};
