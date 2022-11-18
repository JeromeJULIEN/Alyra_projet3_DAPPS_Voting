import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus } from '../../store/actions/app';
import './styles.scss';

const AdminPage = () => {

    const dispatch = useDispatch();
    
    const contract = useSelector(state => state.web3.contract);
    const accounts = useSelector(state => state.web3.accounts)
    const status = useSelector(state => state.app.status)

    const [address,setAddress] = useState("");
    
    //! :::: JS FUNCTIONS ::::
    const handleChange = (event) => {
        setAddress(event.target.value)
    }

    //! :::: SMART CONTRACT > STATUS CHANGE FUNCTIONS ::::
    const startProposalsRegistering = async() =>{
        console.log("entrer dans startProposalRegistering");
        await contract.methods.startProposalsRegistering().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "1") {
            // console.log("road to dispatch");
            dispatch(changeStatus("Start proposal registering"));
        } else {
            alert ("unexpected issue")
        }
    }

    const endProposalsRegistering = async() =>{
        console.log("entrer dans endProposalRegistering");
        await contract.methods.endProposalsRegistering().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "2") {
            // console.log("road to dispatch");
            dispatch(changeStatus("End proposal registering"));
        } else {
            alert ("unexpected issue")
        }
    }

    const startVoting = async() =>{
        console.log("entrer dans startVoting");
        await contract.methods.startVotingSession().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "3") {
            // console.log("road to dispatch");
            dispatch(changeStatus("Start voting"));
        } else {
            alert ("unexpected issue")
        }
    }

    const endVotingSession = async() =>{
        console.log("entrer dans endVotingSession");
        await contract.methods.endVotingSession().call({from : accounts[0]});
        await contract.methods.endVotingSession().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "4") {
            // console.log("road to dispatch");
            dispatch(changeStatus("Voting session finished"));
        } else {
            alert ("unexpected issue")
        }
    }

    const tallyVotes = async() =>{
        console.log("entrer dans tallyVotes");
        await contract.methods.tallyVotes().call({from : accounts[0]});
        await contract.methods.tallyVotes().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "5") {
            // console.log("road to dispatch");
            dispatch(changeStatus("tally votes"));
        } else {
            alert ("unexpected issue")
        }
        const winningProposalId = await contract.methods.winningProposalID().call({from : accounts[0]});
        const winningProposal = await contract.methods.getOneProposal(winningProposalId).call({from : accounts[0]});
        console.log("winning prop==>", winningProposal.description);
        alert(`and the winner is ${winningProposal.description}`)
    }

    const restartSession = async() =>{
        await contract.methods.restartSession().send({from : accounts[0]});
        dispatch(changeStatus("Registering voters"));
    }


   //! :::: SMART CONTACT ==> ADDVOTER() ::::
    const [voterCount, setVoterCount] = useState(0)
    const addVoter = async() =>{
        await contract.methods.addVoter(address).send({from : accounts[0]});
        setAddress("");
        setVoterCount(voterCount+1)
    }


    //! :::: EVENTS MANAGEMENT ::::
    const [voterRegisteredEvent,setVoterRegisteredEvent] = useState([]);

    useEffect(()=> {
        if(contract !== null){
            (async () => {
                let voterRegisteredEvent = await contract.getPastEvents('VoterRegistered',{
                    fromBlock : 0,
                    toBlock:'latest'
                });
                let oldVoterRegisteredEventsArray=[];
                voterRegisteredEvent.forEach(event => {
                    oldVoterRegisteredEventsArray.push(event.returnValues.voterAddress);
                });
                setVoterRegisteredEvent(oldVoterRegisteredEventsArray);
                console.log("old events array =>", oldVoterRegisteredEventsArray);
            })();

        }
    },[contract, voterCount])

    const formatETHAddress = (s, size) =>{;
        var first = s.slice(0, size + 1);
        var last = s.slice(-size);
        return first + "..." + last;
    }
  


  return (
    <>
        <div className='welcome'>
            Welcome M. Jerome POWELL
        </div>
        <div className='adminPage'>
            <div className="status">
                <div className="title">Process management</div>
                <div className="status__current">
                    Current process step : <strong>{status}</strong> 
                </div>
                <div className="status__switch">
                    {status === "Registering voters" && <button onClick={startProposalsRegistering}>Start proposals registering</button>}
                    {status === "Start proposal registering" && <button onClick={endProposalsRegistering}>End proposal registering</button>}
                    {status === "End proposal registering" && <button onClick={startVoting}>Start voting</button>}
                    {status === "Start voting" &&<button onClick={endVotingSession}>End voting session</button>}
                    {status === "Voting session finished" && <button onClick={tallyVotes}>Tally vote</button>}
                    <button onClick={restartSession}>Restart session</button>
                </div>
            </div>
            <div className="voter">
                 <div className="title">Voter management</div>
                <div className="voter__addVoter">
                    <p>Add a new voter</p>
                    <input type="text" placeholder='voter address' onChange={handleChange} value={address}/>
                    <button onClick={addVoter}>Add voter</button>
                </div>
                <div className="voter__registered">
                    <p>Registered voters :</p>

                    {voterRegisteredEvent.map(voter => 
                        <p>{formatETHAddress(voter,4)}</p>
                    )}
                </div>
            </div>
        </div>
    </>
    
  )
}

export default AdminPage