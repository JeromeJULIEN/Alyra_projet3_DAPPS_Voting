import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addProposal, addVote, addVoterToStore, addWinningProposal, changeStatus, deleteProposal, deleteVoters } from '../../store/actions/app';
import './styles.scss';

const AdminPage = () => {

    const dispatch = useDispatch();
    
    const contract = useSelector(state => state.web3.contract);
    const accounts = useSelector(state => state.web3.accounts)
    const status = useSelector(state => state.app.status)
    const proposalCount = useSelector(state => state.app.proposalCount)
    const voters = useSelector(state => state.app.voters)
    const winningProposal = useSelector(state => state.app.winningProposal)

    const [address,setAddress] = useState("");
    
    //! :::: JS FUNCTIONS ::::
    const handleChange = (event) => {
        setAddress(event.target.value)
    }

    //! :::: SMART CONTRACT > STATUS CHANGE FUNCTIONS ::::
    const startProposalsRegistering = async() =>{
        // console.log("entrer dans startProposalRegistering");
        await contract.methods.startProposalsRegistering().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "1") {
            // console.log("road to dispatch");
            dispatch(changeStatus(1));
            dispatch(deleteProposal());
            for(let i=0;i<proposalCount;i++){
                const proposal = await contract.methods.getOneProposal(i).call({from : accounts[0]})
                console.log("proposal i =>", proposal)
                dispatch(addProposal(proposal))
            }
        } else {
            alert ("unexpected issue")
        }
    }

    const endProposalsRegistering = async() =>{
        // console.log("entrer dans endProposalRegistering");
        await contract.methods.endProposalsRegistering().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "2") {
            // console.log("road to dispatch");
            dispatch(changeStatus(2));
        } else {
            alert ("unexpected issue")
        }
    }

    const startVoting = async() =>{
        // console.log("entrer dans startVoting");
        await contract.methods.startVotingSession().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "3") {
            // console.log("road to dispatch");
            dispatch(changeStatus(3));
        } else {
            alert ("unexpected issue")
        }
    }

    const endVotingSession = async() =>{
        // console.log("entrer dans endVotingSession");
        await contract.methods.endVotingSession().call({from : accounts[0]});
        await contract.methods.endVotingSession().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "4") {
            // console.log("road to dispatch");
            dispatch(changeStatus(4));
        } else {
            alert ("unexpected issue")
        }
    }

    const tallyVotes = async() =>{
        // console.log("entrer dans tallyVotes");
        await contract.methods.tallyVotes().call({from : accounts[0]});
        await contract.methods.tallyVotes().send({from : accounts[0]});
        const newStatus = await contract.methods.workflowStatus().call({from : accounts[0]});
        if(newStatus === "5") {
            // console.log("road to dispatch");
            dispatch(changeStatus(5));
        } else {
            alert ("unexpected issue")
        }
        const winningProposalId = await contract.methods.winningProposalID().call({from : accounts[0]});
        const winningProposal = await contract.methods.getOneProposal(winningProposalId).call({from : accounts[0]});
        dispatch(addWinningProposal(winningProposal.description))
    }

    const restartSession = async() =>{
        await contract.methods.restartSession().send({from : accounts[0]});
        dispatch(changeStatus(0));
    }


   //! :::: SMART CONTACT ==> ADDVOTER() ::::
    const [voterCount, setVoterCount] = useState(0)
    const addVoter = async() =>{
        await contract.methods.addVoter(address).send({from : accounts[0]});
        dispatch(addVoterToStore(address));
        setAddress("");
        setVoterCount(voterCount+1)
    }


    //! :::: EVENTS MANAGEMENT ::::
    //! VOTERS
    const [voterRegisteredEvent,setVoterRegisteredEvent] = useState([]);

    useEffect(()=> {
        if(contract !== null){
            (async () => {
                // VOTER REGISTRATION INFORMATION
                let voterRegisteredEvent = await contract.getPastEvents('VoterRegistered',{
                    fromBlock : 0,
                    toBlock:'latest'
                });
                let oldVoterRegisteredEventsArray=[];
                voterRegisteredEvent.forEach(event => {
                    oldVoterRegisteredEventsArray.push(event.returnValues.voterAddress);
                });
                setVoterRegisteredEvent(oldVoterRegisteredEventsArray);
                dispatch(deleteVoters())
                oldVoterRegisteredEventsArray.map(voter => dispatch(addVoterToStore(voter)))

                // VOTER VOTING INFORMATION
                let votingEvent = await contract.getPastEvents('Voted',{
                    fromBlock:0,
                    toBlock:'latest'
                });
                let oldVotingEventsArray=[];
                votingEvent.forEach(event => {
                    oldVotingEventsArray.push(event.returnValues)
                    dispatch(addVote(event.returnValues.voter,event.returnValues.proposalId))
                })
            })();

        }
    },[contract, voterCount])

    const formatETHAddress = (s, size) =>{;
        var first = s.slice(0, size + 1);
        var last = s.slice(-size);
        return first + "..." + last;
    }

    //!STATUS
    useEffect(()=> {
        if(contract !== null){
            (async () => {
                let statusRegisteredEvent = await contract.getPastEvents('WorkflowStatusChange',{
                    fromBlock : 0,
                    toBlock:'latest'
                });
                let oldStatusRegisteredEventsArray=[];
                statusRegisteredEvent.forEach(event => {
                    oldStatusRegisteredEventsArray.push(event.returnValues.newStatus);
                });
                oldStatusRegisteredEventsArray.map(status => dispatch(changeStatus(status)))
            })();

        }
    },[contract])
  



  return (
    <>
        <div className='welcome'>
            Welcome M. Jerome POWELL
        </div>
        <div className='adminPage'>
            <div className="status">
                <div className="title">Process management</div>
                <div className="status__current">
                    Current process step :  
                    {status == "0" && <strong> Registering voters</strong>}
                    {status == "1" && <strong> Proposal registering open</strong>}
                    {status == "2" && <strong> Proposal registering close</strong>}
                    {status == "3" && <strong> Voting session open</strong>}
                    {status == "4" && <strong> Voting session close</strong>}
                    {status == "5" && <strong> Voting tallied</strong>}


                </div>
                <div className="status__switch">
                    {status == "0" && <button onClick={startProposalsRegistering}>Start proposals registering</button>}
                    {status == "1" && <button onClick={endProposalsRegistering}>End proposal registering</button>}
                    {status == "2" && <button onClick={startVoting}>Start voting</button>}
                    {status == "3" &&<button onClick={endVotingSession}>End voting session</button>}
                    {status == "4" && <button onClick={tallyVotes}>Tally vote</button>}
                    <button onClick={restartSession}>Restart process</button>
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

                    {voters.map(voter => 
                    <div className='voter__registered__item'>
                        <p className='tag tag--address'>{formatETHAddress(voter.address,4)}</p>
                        {voter.hasVoted ?(<><p className='tag tag--hasVoted'>has voted</p><p className='tag tag--id'> proposal {voter.proposalVoted}</p></>):(<p className='tag tag--notVoted'>not voted</p> )}
                    </div>
                    )}
                </div>
            </div>
        </div>
        {status == 5 && 
        <div className="winningProposal">
            <div>The winner is {winningProposal}</div>
            <div>We should consider hire him at the F.E.D...</div>
        </div>}
    </>
    
  )
}

export default AdminPage