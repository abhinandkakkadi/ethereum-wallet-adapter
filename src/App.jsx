import { base, mainnet } from "viem/chains";
import "./App.css";
import { http, parseEther } from "viem";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { createConfig, injected, useAccount, useBalance, useConnect, useEnsAvatar, useEnsName, useSendTransaction, WagmiProvider } from "wagmi";
import { metaMask, safe, walletConnect } from "wagmi/connectors";
import { useReadContract } from 'wagmi'
import { wagmiContractConfig } from "./contract";

const projectId = "wallet-connect-project-id";

function ReadContract() {
  const { data: balance } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'balanceOf',
    args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
  })

  return (
    <div>Balance: {balance?.toString()}</div>
  )
}

const config = createConfig({
  chains: [mainnet, base],
  connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnector />
        <EthSend />
        <ConnectedAddress />
        <ReadContract/>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

async function sendTransaction(to, value) {
  const {data: hash, sendTransaction} = useSendTransaction()
}

function EthSend() {
  const {data: hash, sendTransaction} = useSendTransaction()

  function sendEth(to, value) {
    sendTransaction({to: document.getElementById("address").value, value: "100000000000000000"})
  }

  return (
    <div>
      <input id="address" type="text" placeholder="Address"></input>
      <button className="border-2 border-solid" onClick={sendEth}>Send 0.1 ETH</button>
    </div>
  );
}

function ConnectedAddress() {
  const {address} = useAccount()
  const {balance} = useBalance({address})

  return <div>
    <div>Name: {ensName}</div>
    <div>{address} - {balance?.data?.formatted}</div>
    </div>
}


export function WalletConnector() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => {
    return (
      <div className="flex flex-col flex-gap-2">
        <button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      </div>
    );
  });
}

export default App;
