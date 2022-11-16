import React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {changeStatus} from '../../store/actions/app';
import { useState } from 'react';
import Voting from './Voting';






const Main = () => {

   
    const dispatch = useDispatch();
    
    const contract = useSelector(state => state.web3.contract);
    const accounts = useSelector(state => state.web3.accounts)
    const status = useSelector(state => state.app.status)

    const [address,setAddress] = useState("");
    
    // :::: JS FUNCTIONS ::::
    const handleChange = (event) => {
        setAddress(event.target.value)
    }

    // :::: SMART CONTRACT > STATUS CHANGE FUNCTIONS ::::
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
        if(newStatus === "4") {
            // console.log("road to dispatch");
            dispatch(changeStatus("Voting session finished"));
        } else {
            alert ("unexpected issue")
        }
        const winningProposalId = await contract.methods.winningProposalID().call({from : accounts[0]});
        const winningProposal = await contract.methods.getOneProposal(winningProposalId).call({from : accounts[0]});
        console.log("winning prop==>", winningProposal);
    }

    const restartSession = async() =>{
        await contract.methods.restartSession().send({from : accounts[0]});
        dispatch(changeStatus("Registering voters"));
    }


   
    
    const addVoter = async() =>{
        await contract.methods.addVoter(address).send({from : accounts[0]});
    }

    

   
    

    return (
        <div>
            <div className="status">
                <div className="status__title">
                    Only for the master of ceremonies
                </div>
                <div className="status__current">
                   Current process step : {status}
                </div>
                <button onClick={startProposalsRegistering}>Start proposals registering</button>
                <button onClick={endProposalsRegistering}>End proposal registering</button>
                <button onClick={startVoting}>Start voting</button>
                <button onClick={endVotingSession}>End voting session</button>
                <button onClick={tallyVotes}>Tally vote</button>
                <button onClick={restartSession}>Restart session</button>
            </div>
            <div className="addVoter">
                <input type="text" placeholder='voter address' onChange={handleChange} value={address}/>
                <button onClick={addVoter}>Add voter</button>
            </div>
        {status !== "Registering voters" ? (
            <Voting/>

        ) :(<><p>Proposals will be shown once the voters registered</p></>)
        }
            
        </div>
    )
}

export default Main