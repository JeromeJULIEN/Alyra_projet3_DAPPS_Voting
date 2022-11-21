import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProposal, addVote, increaseProposalCount } from '../../store/actions/app';
import './styles.scss';



const Voting = () => {

    const dispatch= useDispatch();

    const contract = useSelector(state => state.web3.contract);
    const accounts = useSelector(state => state.web3.accounts);
    const status = useSelector(state => state.app.status);
    const proposalCount = useSelector(state => state.app.proposalCount);
    const proposalList = useSelector(state => state.app.proposalList)
    const [newProposal,setNewProposal] = useState("");
    

    const handleChange = (event) => {
        setNewProposal(event.target.value)
        console.log("newProposal =>", event.target.value);
    }

    const sendNewProposal = async() => {
        const value = newProposal
        console.log("newProposal value =>", value);
        await contract.methods.addProposal(value).send({from:accounts[0]})
        setNewProposal("");
        const proposal = await contract.methods.getOneProposal(proposalCount).call({from:accounts[0]})
        console.log("proposal after add to contract", proposal);
        dispatch(addProposal(proposal));
        dispatch(increaseProposalCount(proposalCount + 1));
    }

    const setVote = async(event) =>{
        await contract.methods.setVote(event.target.value).call({from:accounts[0]}).then(console.log);
        await contract.methods.setVote(event.target.value).send({from:accounts[0]});
        dispatch(addVote(accounts[0],event.target.value))
    }

    //! GET THE VOTED PROPOSAL BY ADDRESS
    const voters = useSelector(state => state.app.voters)
    const getVotedProposal = () =>{
        const activeVoter = voters.filter(voter => voter.address == accounts[0]);
        // console.log("active voter =>", activeVoter)
        if(activeVoter[0].hasVoted){
            // console.log("has voted");
            return(activeVoter[0].proposalVoted)
        } else {
            // return(console.log("active voter hasn't voted yet"));
        }
    }
    
    const votedProposal = getVotedProposal()

    const winningProposal = useSelector(state => state.app.winningProposal)
  
    



    return (
        <div className='voting'>
            <div className="voting__title">
                <p>Vote for the best crypto scenario, category : <strong>BEST DISASTER</strong> </p>
                <p>The nominees are :</p>
            </div>
            {status != 5 && 
            <div className="voting__proposal" >
                {proposalList.map((proposal,index) => (
                        <div className='voting__proposal__item' key={index}>
                            <p>{proposal.description[0]}</p>
                            {status == "3" && index != votedProposal && <button className='voting__proposal__button' value={index} onClick={setVote}>Vote</button>}
                            {status == "3" && index == votedProposal && <button className='voting__proposal__voted' value={index} onClick={setVote}>Voted</button>}
                        </div>
                ))}
            </div>
            }
            
            {status == "1" && 
            <div className='addProposal'>
                <input className='addProposal__input' type="text" placeholder='add a new proposal' value={newProposal} onChange={handleChange}/>
                <button className='addProposal__button' onClick={sendNewProposal}>Add proposal</button>
            </div>
            }
            {status =="5" && <div className='winningMessage'>And the winner is {winningProposal} </div>}
            
            
        </div>
    )
}

export default Voting