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
  const [toAmount, setToAmount] = useState("");

  const [routeTxData, setRouteTxData] = useState<any>(null);
  const [apporvalTxData, setApprovalTxData] = useState<any>(null);

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
                setFromAmount((parseInt(e.target.value) * 1000000).toString());
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
              // swap();
            }}
            className={styles.swapButton}
          >
            Fetch Route
          </button>
          <div className={styles.swapRow}>
            {/* Display the calculated "To" amount. This field is read-only. */}
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="To Amount (Estimated)"
            />
          </div>
        </form>
        <button
          type="button"
          onClick={() => {
            // sendApproveTx();
          }}
          className={styles.swapButton + " " + styles.approvalButton}
        >
          Send Approval Tx
        </button>
        <button
          type="button"
          onClick={() => {
            // sendBridgeTx();
          }}
          className={styles.swapButton}
        >
          Send Bridge Tx
        </button>
      </main>
    </div>
  );
};

export default Home;
