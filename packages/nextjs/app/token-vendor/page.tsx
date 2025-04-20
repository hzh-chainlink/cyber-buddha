"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { getTokenPrice, multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

const TokenVendor: NextPage = () => {
  const [toAddress, setToAddress] = useState("");
  const [tokensToSend, setTokensToSend] = useState("");
  const [tokensToBuy, setTokensToBuy] = useState<string | bigint>("");
  const [isApproved, setIsApproved] = useState(false);
  const [tokensToSell, setTokensToSell] = useState<string>("");

  const { address } = useAccount();
  const { data: yourTokenSymbol } = useScaffoldReadContract({
    contractName: "YourToken",
    functionName: "symbol",
  });

  const { data: yourTokenBalance } = useScaffoldReadContract({
    contractName: "YourToken",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: vendorContractData } = useDeployedContractInfo("Counter");
  const { writeContractAsync: writeVendorAsync } = useScaffoldWriteContract("Counter");
  const { writeContractAsync: writeYourTokenAsync } = useScaffoldWriteContract("YourToken");

  // const { data: vendorTokenBalance } = useScaffoldReadContract({
  //   contractName: "YourToken",
  //   functionName: "balanceOf",
  //   args: [vendorContractData?.address],
  // });

  // const { data: vendorEthBalance } = useWatchBalance({ address: vendorContractData?.address });

  // const { data: tokensPerEth } = useScaffoldReadContract({
  //   contractName: "Vendor",
  //   functionName: "tokensPerEth",
  // });

  const { data: vendorTokenBalance } = useScaffoldReadContract({
    contractName: "Counter",
    functionName: "number",
  });

  const { data: vendorEthBalance } = useScaffoldReadContract({
    contractName: "YourToken",
    functionName: "totalSupply"
  });

  const {data: minimumUsd} = useScaffoldReadContract({
    contractName: "Counter",
    functionName: "MINIMUM_USD"
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex flex-col items-center bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-24 w-full max-w-lg">
          {/* 佛祖馈赠 */}
          <div className="flex justify-between w-full text-xl">
            <div className="text-right font-bold">🙏 佛祖馈赠</div>
            <div className="text-left inline-flex items-center ml-4">
              {parseFloat(formatEther(yourTokenBalance || 0n)).toFixed(4)}
              <span className="font-bold ml-2">{yourTokenSymbol}</span>
            </div>
          </div>

          <hr className="w-full border-secondary my-3" />

          {/* 功德箱 */}
          <div className="flex justify-between w-full">
            <div className="text-right">💰 功德箱</div>
            <div className="text-left ml-4">
              {Number(vendorTokenBalance || 0n).toFixed(0)}
              {/* <span className="font-bold ml-1">{yourTokenSymbol}</span> */}
            </div>
          </div>

          {/* 功德池 */}
          <div className="flex justify-between w-full">
            <div className="text-right">🏦 功德池</div>
            <div className="text-left ml-4">
              {Number(formatEther(vendorEthBalance || 0n)).toFixed(4)}
              <span className="font-bold ml-1">{yourTokenSymbol}</span>
            </div>
          </div>
        </div>

        {/* Buy Tokens */}
        <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="text-xl font-bold">🪔 赛博上香</div>
          {/* <div>{tokensPerEth?.toString() || 0} tokens per ETH</div> */}

          <div className="w-full flex flex-col space-y-2">
            <IntegerInput
              placeholder={`最低 ${parseFloat(formatEther(minimumUsd || 0n)).toFixed(2)} 美元（RON)`}
              value={tokensToBuy.toString()}
              onChange={value => setTokensToBuy(value)}
              disableMultiplyBy1e18
            />
          </div>

          <button
            className="btn btn-secondary mt-2"
            onClick={async () => {
              try {
                await writeVendorAsync({ functionName: "incrementWithFund", value: BigInt(tokensToBuy) });
              } catch (err) {
                console.error("Error calling buyTokens function");
              }
            }}
          >
            祈愿一次 💎
          </button>
        </div>

        {/* {!!yourTokenBalance && ( */}
        {/* {(
          <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
            <div className="text-xl">Transfer tokens</div>
            <div className="w-full flex flex-col space-y-2">
              <AddressInput placeholder="to address" value={toAddress} onChange={value => setToAddress(value)} />
              <IntegerInput
                placeholder="amount of tokens to send"
                value={tokensToSend}
                onChange={value => setTokensToSend(value as string)}
                disableMultiplyBy1e18
              />
            </div>

            <button
              className="btn btn-secondary"
              onClick={async () => {
                try {
                  await writeYourTokenAsync({
                    functionName: "transfer",
                    args: [toAddress, multiplyTo1e18(tokensToSend)],
                  });
                } catch (err) {
                  console.error("Error calling transfer function");
                }
              }}
            >
              Send Tokens
            </button>
          </div>
        )} */}

        {/* Sell Tokens */}
        {/* {!!yourTokenBalance && (
          <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
            <div className="text-xl">Sell tokens</div>
            <div>{tokensPerEth?.toString() || 0} tokens per ETH</div>

            <div className="w-full flex flex-col space-y-2">
              <IntegerInput
                placeholder="amount of tokens to sell"
                value={tokensToSell}
                onChange={value => setTokensToSell(value as string)}
                disabled={isApproved}
                disableMultiplyBy1e18
              />
            </div>

            <div className="flex gap-4">
              <button
                className={`btn ${isApproved ? "btn-disabled" : "btn-secondary"}`}
                onClick={async () => {
                  try {
                    await writeYourTokenAsync({
                      functionName: "approve",
                      args: [vendorContractData?.address, multiplyTo1e18(tokensToSell)],
                    });
                    setIsApproved(true);
                  } catch (err) {
                    console.error("Error calling approve function");
                  }
                }}
              >
                Approve Tokens
              </button>

              <button
                className={`btn ${isApproved ? "btn-secondary" : "btn-disabled"}`}
                onClick={async () => {
                  try {
                    await writeVendorAsync({ functionName: "sellTokens", args: [multiplyTo1e18(tokensToSell)] });
                    setIsApproved(false);
                  } catch (err) {
                    console.error("Error calling sellTokens function");
                  }
                }}
              >
                Sell Tokens
              </button>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default TokenVendor;
