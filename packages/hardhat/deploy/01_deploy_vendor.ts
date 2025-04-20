import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract, keccak256, toUtf8Bytes } from "ethers";

/**
 * Deploys a contract named "Vendor" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deployVendor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  // // Deploy Vendor
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const yourToken = await hre.ethers.getContract<Contract>("YourToken", deployer);
  const yourTokenAddress = await yourToken.getAddress();
  await deploy("Counter", {
    from: deployer,
    // Contract constructor arguments
    args: [yourTokenAddress, "0xBaA0AfA2f390349e0074bE787509a098e3044fc8"],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  const vendor = await hre.ethers.getContract<Contract>("Counter", deployer);
  const vendorAddress = await vendor.getAddress();
  // // Transfer tokens to Vendor
  // await yourToken.transfer(vendorAddress, hre.ethers.parseEther("1000"));
  // // Transfer contract ownership to your frontend address
  // await vendor.transferOwnership("**YOUR FRONTEND ADDRESS**");

  const MIINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));
  const tx = await yourToken.grantRole(MIINTER_ROLE, vendorAddress);
  await tx.wait();

  console.log(`✅ Granted MINTER_ROLE to Counter contract at ${vendorAddress}`);
};

export default deployVendor;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Vendor
deployVendor.tags = ["Vendor"];
