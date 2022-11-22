import { useEffect,useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';
import Main from './components/Main';
import Web3 from 'web3';
import { initWeb3 } from './store/actions/web3';
import Header from './components/Header';
import Footer from './components/Footer';
import {Routes, Route, useLocation} from 'react-router-dom';
import AdminPage from './components/AdminPage';
import Menu from './components/Menu';
import { addProposal, deleteProposal } from './store/actions/app';

function App() {

  const isLogged = useSelector(state => state.app.isLogged)
  const proposalCount = useSelector(state => state.app.proposalCount)
  
  const artifact = require("./contracts/Voting.json");
    const dispatch = useDispatch();
    // initialization of web3 constants
    const init = useCallback(
      async artifact => {
        if (artifact) {
          const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
          const accounts = await web3.eth.requestAccounts();
          const networkID = await web3.eth.net.getId();
          const blockNumber = await web3.eth.getBlockNumber()
          console.log(blockNumber);
          const { abi } = artifact;
          let address, contract, owner;
          try {
            address = artifact.networks[networkID].address;
            contract = new web3.eth.Contract(abi, address);
            owner = await contract.methods.owner().call()
            console.log("owner =>",owner);
          } catch (err) {
            console.error(err);
          }
          dispatch(initWeb3(artifact, web3, accounts, networkID, contract,owner, blockNumber));

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
      <Header/>
      {isLogged? (
        <>
          <Menu/>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/admin" element={<AdminPage />} />

          </Routes>
        </>
      
      ):(
        <p className='connectMessage'>connect your wallet</p>
      )}
      <Footer/>
     
    </div>
  );
}

export default App;
