import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVote, increaseProposalCount } from '../../store/actions/app';
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

    const addProposal = async() => {
        const value = newProposal
        console.log("newProposal value =>", value);
        await contract.methods.addProposal(value).send({from:accounts[0]})
        setNewProposal("");
        dispatch(increaseProposalCount(proposalCount + 1))
    }

    const setVote = async(event) =>{
        await contract.methods.setVote(event.target.value).call({from:accounts[0]}).then(console.log);
        await contract.methods.setVote(event.target.value).send({from:accounts[0]});
        dispatch(addVote(accounts[0],event.target.value))
    }


    return (
        <div>
            <p>Vote for the best crypto scenario, category : BEST DISASTER</p>
            <p>The nominees are :</p>
            <p>
                {proposalList.map((proposal,index) => (
                    <div className="proposal" key={index}>
                        <div className='proposal__item'>
                            <p>{proposal.description}</p>
                            {status == "3" ? 
                            <>
                            <button value={index} onClick={setVote}>Vote</button>
                            </> : 
                            <></>}
                        </div>
                    </div>
                ))}
            </p>
            {status == "1" && 
            <div>
                <input type="text" placeholder='add a new proposal' value={newProposal} onChange={handleChange}/>
                <button onClick={addProposal}>Add proposal</button>
            </div>
            }
            
            
        </div>
    )
}

export default Voting