import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useSendTransaction, useAccount } from "wagmi";
const Home: NextPage = () => {
  const { data: hash, sendTransaction } = useSendTransaction();
  const { address, chainId } = useAccount();

  const [fromToken, setFromToken] = useState("");
  const [toChain, setToChain] = useState(0);
  const [toToken, setToToken] = useState("");
  const [fromAmount, setFromAmount] = useState("");

  const [apporvalTxData, setApprovalTxData] = useState<any>();
  const [executionTxData, setExecutionTxData] = useState<any>();

  const chains = [
    { id: 56, name: "Binance Smart Chain" },
    { id: 137, name: "Polygon" },
  ];

  // Example token list
  const tokens = [
    {
      symbol: "USDC",
      name: "USDC",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      chainId: 137,
    },
    {
      symbol: "USDT",
      name: "USDT",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      chainId: 56,
    },
  ];

  const fetchDepositCalldata = async (): Promise<any> => {
    let response;
    let responseInJson;
    let finalResponse = {
      success: false,
      data: {
        approvalTxs: [],
        executionTxs: [],
      }
    };

    try {
      const params = new URLSearchParams({
        fromChainId: chainId?.toString() || "",
        toChainId: toChain.toString() || "",
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        fromAmount: (Number(fromAmount) * 1000000).toString(),
        userAddress: address?.toString() || "",
        recipient: address?.toString() || "",
        routeType: "Value",
      });
      response = await fetch(`/api?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    catch (error) {
      console.error("Failed to fetch the deposit calldata:", error);
    }

    try {
      responseInJson = await response?.json();

      if (!responseInJson.success) {
        throw new Error("API response was not successful");
      } else {
        finalResponse = {
          success: true,
          data: {
            approvalTxs: responseInJson.data.approvalTxs,
            executionTxs: responseInJson.data.executionTxs,
          },
        };
      }
    } catch (error) {
      console.error("Failed to parse the response:", error);
    }
    return finalResponse;
  };


  const swap = async () => {
    const calldata = await fetchDepositCalldata();

    setApprovalTxData(calldata.data.approvalTxs[0]);
    setExecutionTxData(calldata.data.executionTxs[0]);

  };

  const sendApprovalTx = () => {
    console.log("Sending Approval Tx Data");
    sendTransaction({
      to: `0x${(apporvalTxData?.txTarget)?.substring(2)}`,
      data: `0x${(apporvalTxData?.txData)?.substring(2)}`,
    });
  };

  const sendExecutionTx = () => {
    sendTransaction({
      to: `0x${(executionTxData?.txTarget)?.substring(2)}`,
      data: `0x${(executionTxData?.txData)?.substring(2)}`,
    });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectButton />
        <form className={styles.swapForm}>
          <div className={styles.swapRow}>
            <select
              value={fromToken}
              onChange={(e) => {
                tokens.map((token) => {
                  if (token.symbol == e.target.value) {
                    setFromToken(token.address);
                  }
                });
              }}
              required
            >
              <option value="">Select From Token</option>
              {tokens.map((token) => {
                if (token.chainId == chainId) {
                  return (
                    <option key={token.symbol} value={token.symbol}>
                      {token.name}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <div className={styles.swapRow}>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => {
                setFromAmount(e.target.value);
              }}
              placeholder="From Amount"
              required
            />
          </div>
          <div className={styles.swapRow}>
            <select
              onChange={(e) => {
                setToChain(parseInt(e.target.value));
              }}
              required
            >
              <option value="">Select Destination Chain</option>
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.swapRow}>
            <select
              value={toToken}
              onChange={(e) => {
                tokens.map((token) => {
                  if (token.symbol == e.target.value) {
                    setToToken(token.address);
                  }
                });
              }}
              required
            >
              <option value="">Select To Token</option>
              {tokens.map((token) => {
                if (token.chainId == toChain) {
                  return (
                    <option key={token.symbol} value={token.symbol}>
                      {token.name}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              swap();
            }}
            className={styles.swapButton}
          >
            Fetch Deposit Calldata
          </button>
        </form>
        <button
          type="button"
          onClick={sendApprovalTx}
          className={styles.swapButton + " " + styles.approvalButton}
        >
          Send Approval Tx
        </button>
        <button
          type="button"
          onClick={sendExecutionTx}
          className={styles.swapButton}
        >
          Send Bridge Tx
        </button>
      </main>
    </div>
  );
};

export default Home;
