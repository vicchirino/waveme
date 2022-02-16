import './App.css';
import React from "react"
import { ethers } from "ethers"
import abi from "./utils/WavePortal.json";
import Loader from './Loader/Loader';

function App() {


  const [loading, setIsLoading] = React.useState<Boolean>(false)

  // Just a state variable we use to store our user's public wallet.
  const [currentAccount, setCurrentAccount] = React.useState("")

  // Create a variable here that holds the contract address after you deploy!
  const contractAddress = "0x0fDB5F1809E3e254c281Ca455D0FA5cC7DA02632";

  // Create a variable here that references the abi content!
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
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
      } else {
        console.log("No authorized account found")
      }

    } catch (error) {
      console.log(error)
    }
  }

  // Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      // @ts-expect-error
      const { ethereum } = window

      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }

      setIsLoading(true)
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setIsLoading(false)

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  
  // This runs our function when the page loads
  React.useEffect(() => {
    checkIfWalletIsConnected()
  },[])

  const wave = async () => {
    try {
      // @ts-expect-error window doesn't have explicit ethereum object.
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        
        // Execute the actual wave from your smart contract
        setIsLoading(true)
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);
        
        await waveTxn.wait();
        setIsLoading(false)
        console.log("Mined -- ", waveTxn.hash);
        
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="subheader">
          I'm Victor from Buenos Aires, Argentina. Connect your Ethereum wallet and wave at me!
        </div>

        <div className="body">
          {loading ? (
            <Loader />
          ) : !currentAccount ? (
            <button className='waveButton' onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <button className="waveButton" onClick={wave}>
              Wave at Me
            </button>
          )
          }
        </div>

      </div>
    </div>
  );
}

export default App
