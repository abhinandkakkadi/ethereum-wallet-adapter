import { mainnet } from 'viem/chains'
import './App.css'
import { createPublicClient, http } from 'viem'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

function App() {
  const [balance, setBalance] = useState(0)

  async function getBalance() {
   const balance = await client.getBalance({
      address: "0x5fb0a1e08571501430F278e408CB4c04b0f64EE9"
    })

    setBalance(Number(balance.toString()))
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <button onClick={getBalance}></button>
      {balance && <p>Balcne - {balance}</p>}
    </div>
  )
}

export default App
