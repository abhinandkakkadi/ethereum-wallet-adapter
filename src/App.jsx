import { base, mainnet, sepolia } from "viem/chains";
import "./App.css";
import { createPublicClient, http } from "viem";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { createConfig, injected, useConnect, WagmiProvider } from "wagmi";
import { metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = "wallet-connect-project-id";

export const config = createConfig({
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
      <QueryClientProvider client={queryClient}></QueryClientProvider>
    </WagmiProvider>
  );
}

export function WalletOptions() {
  const {connectors, connect} = useConnect()

  return connectors.map((connector)=>{
    return <button key={connector.uid} onClick={() => connect({ connector })}>{connector.name}</button>
  })

}

export default App;
