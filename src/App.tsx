import "./App.css"
import React from "react"
import { ethers } from "ethers"
import abi from "./utils/WavePortal.json"
import Loader from "./components/Loader/Loader"
import { Wave } from "./types"
import WavesTable from "./components/WavesTable/WavesTable"

function App() {
  const [loading, setIsLoading] = React.useState<Boolean>(false)

  // Just a state variable we use to store our user's public wallet.
  const [currentAccount, setCurrentAccount] = React.useState("")

  // All state property to store all waves

  const [allWaves, setAllWaves] = React.useState<Wave[]>([])

  // Create a variable here that holds the contract address after you deploy!
  const contractAddress = "0x758c7b2A31A8E90A1d8C2cd71849ef0E6387Fb59"

  // Create a variable here that references the abi content!
  const contractABI = abi.abi

  // Create a method that gets all waves from your contract
  const getAllWaves = React.useCallback(async () => {
    try {
      // @ts-expect-error
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        // Call the getAllWaves method from your Smart Contract
        const waves = await wavePortalContract.getAllWaves()

        // We only need address, timestamp, and message in our UI so let's pick those out
        let wavesCleaned: Wave[] = []
        waves.forEach(
          (wave: { waver: string; timestamp: number; message: string }) => {
            wavesCleaned.push({
              address: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message,
            })
          }
        )

        // Store our data in React State
        setAllWaves(wavesCleaned)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }, [contractABI])

  const checkIfWalletIsConnected = React.useCallback(async () => {
    try {
      // First make sure we have access to window.ethereum
      // @ts-expect-error
      const { ethereum } = window
      if (!ethereum) {
        console.log("Make sure you have metamask!")
      } else {
        console.log("We have the ethereum object", ethereum)
      }

      // Check if we're authorized to acess the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log("ACCOUNTS OBJECT", accounts)
      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log("Found an authorized account: ", account)
        setCurrentAccount(account)
        await getAllWaves()
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error)
    }
  }, [getAllWaves])

  // Implement your connectWallet method here
  const connectWallet = React.useCallback(async () => {
    try {
      // @ts-expect-error
      const { ethereum } = window

      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }

      setIsLoading(true)
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })
      setIsLoading(false)

      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
      await getAllWaves()
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }, [getAllWaves])

  // This runs our function when the page loads
  React.useEffect(() => {
    checkIfWalletIsConnected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wave = React.useCallback(async () => {
    try {
      // @ts-expect-error window doesn't have explicit ethereum object.
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        let count = await wavePortalContract.getTotalWaves()
        console.log("Retrieved total wave count...", count.toNumber())

        // Execute the actual wave from your smart contract
        setIsLoading(true)
        const waveTxn = await wavePortalContract.wave("Hola", {
          gasLimit: 300000,
        })
        console.log("Mining...", waveTxn.hash)

        await waveTxn.wait()
        setIsLoading(false)
        console.log("Mined -- ", waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()
        console.log("Retrieved total wave count...", count.toNumber())

        // TODO: move to a separate function

        // Call the getAllWaves method from your Smart Contract
        const waves = await wavePortalContract.getAllWaves()

        // We only need address, timestamp, and message in our UI so let's pick those out
        let wavesCleaned: Wave[] = []
        waves.forEach(
          (wave: { waver: string; timestamp: number; message: string }) => {
            wavesCleaned.push({
              address: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message,
            })
          }
        )

        // Store our data in React State
        setAllWaves(wavesCleaned)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }, [contractABI])

  /**
   * Listen in for emitter events!
   */
  React.useEffect(() => {
    let wavePortalContract: ethers.Contract

    const onNewWave = (from: string, timestamp: number, message: string) => {
      console.log("NewWave", from, timestamp, message)
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ])
    }

    // @ts-expect-error
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )
      wavePortalContract.on("NewWave", onNewWave)
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="subheader">
          I'm Victor from Buenos Aires, Argentina. Connect your Ethereum wallet
          and wave at me!
        </div>

        <div className="body">
          {loading ? (
            <Loader />
          ) : !currentAccount ? (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <>
              <button className="waveButton" onClick={wave}>
                Wave at Me
              </button>
            </>
          )}
          {allWaves.length > 0 && (
            <div className="tableContainer">
              <WavesTable waves={allWaves} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
