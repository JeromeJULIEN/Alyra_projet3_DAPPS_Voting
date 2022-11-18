import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increaseProposalCount } from '../../store/actions/app';
import Web3 from 'web3';

import './styles.scss';



const Voting = () => {

    const dispatch= useDispatch();
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")

    const contract = useSelector(state => state.web3.contract);
    const accounts = useSelector(state => state.web3.accounts);
    const status = useSelector(state => state.app.status);
    const proposalCount = useSelector(state => state.app.proposalCount);
    const [proposalArray,setProposalArray] = useState([])
    const [newProposal,setNewProposal] = useState("");
    const [proposalId,setProposalId] = useState("");

    useEffect(()=> {
        if(contract !==null){
            (async() => {
                // console.log('entrée dans useEffect voting')
                setProposalArray([]);
                for(let i=0;i<proposalCount;i++){
                    const proposal = await contract.methods.getOneProposal(i).call({from : accounts[0]})
                    // console.log("proposal i =>", proposal.description)
                    setProposalArray(proposalArray => [...proposalArray, proposal.description])
                }
                console.log('proposal array =>', proposalArray)
                // console.log('typeOf proposalArray =>', typeof(proposalArray));
            })()

        }
    }, [proposalCount])

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
        const voterAddress = web3.eth.requestAccounts();
        console.log("accounts =>", accounts[0]);
        await contract.methods.setVote(event.target.value).call({from:accounts[0]}).then(console.log);
        await contract.methods.setVote(event.target.value).send({from:accounts[0]});
    }

    const handleChangeId = (event) => {
        setProposalId(event.target.value)
        console.log("proposalId =>", event.target.value);
    }

    const getOneProposal = async() => {
        const proposal = await contract.methods.getOneProposal(proposalId).call({from:accounts[0]})
        console.log("proposal by id =>",proposal);
    }



    return (
        <div>
            <p>Vote for the best crypto scenario, category : BEST DISASTER</p>
            <p>The nominees are :</p>
            <p>
                {proposalArray.map((proposal,index) => (
                    <div className="proposal">
                        <div className='proposal__item'>
                            <p>{proposal}</p>
                            {status === "Start voting" ? 
                            <>
                            <button value={index} onClick={setVote}>Vote</button>
                            </> : 
                            <></>}
                        </div>
                    </div>
                ))}
            </p>
            <div>
                <input type="text" placeholder='add a new proposal' value={newProposal} onChange={handleChange}/>
                <button onClick={addProposal}>Add proposal</button>
            </div>
            
            
        </div>
    )
}

export default Voting