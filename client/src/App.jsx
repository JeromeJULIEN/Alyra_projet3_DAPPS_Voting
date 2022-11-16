import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import Main from './components/Main';
import Web3 from 'web3';
import { initWeb3 } from './store/actions/web3';
import Header from './components/Header';
import Footer from './components/Footer';
import Logger from './components/Logger';

function App() {
  
  const artifact = require("./contracts/Voting.json");
    const dispatch = useDispatch();
    // initialization of web3 constants
    useEffect(()=> {
        const init = async() => {
            const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
            const accounts = await web3.eth.requestAccounts();
            console.log("accounts ==>", accounts);
            const networkID = await web3.eth.net.getId();
            console.log("networkID ==>", networkID)
            const { abi } = artifact;
            let address, contract;
            console.log("ABI ==>", abi)
            try {
              address = artifact.networks[networkID].address;
              console.log('address ==>', address)
              contract = new web3.eth.Contract(abi, address);
              console.log("contract ==>", contract)
            } catch (err) {
              console.error(err);
            }
            dispatch(initWeb3(artifact, web3, accounts, networkID, contract));
            ;

        };

        init()
    },[])
  
  return (
    <div className="App">
      <header className="App-header">
        <Header/>
        <Main />
        <Logger/>
        <Footer/>
      </header>
    </div>
  );
}

export default App;
