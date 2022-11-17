import { useEffect,useCallback } from 'react';
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
    const init = useCallback(
      async artifact => {
        if (artifact) {
          const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
          const accounts = await web3.eth.requestAccounts();
          const networkID = await web3.eth.net.getId();
          const { abi } = artifact;
          let address, contract;
          try {
            address = artifact.networks[networkID].address;
            contract = new web3.eth.Contract(abi, address);
          } catch (err) {
            console.error(err);
          }
          dispatch(initWeb3(artifact, web3, accounts, networkID, contract));
          ;
        }
      }, []);
  
    useEffect(() => {
      const tryInit = async () => {
        try {
          const artifact = require("./contracts/Voting.json");
          init(artifact);
        } catch (err) {
          console.error(err);
        }
      };
  
      tryInit();
    }, [init]);

    useEffect(() => {
      const events = ["chainChanged", "accountsChanged"];
      const handleChange = () => {
        init(artifact);
      };
  
      events.forEach(e => window.ethereum.on(e, handleChange));
      return () => {
        events.forEach(e => window.ethereum.removeListener(e, handleChange));
      };
    }, [init, artifact]);
  

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
