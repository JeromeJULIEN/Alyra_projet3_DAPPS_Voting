import React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {changeStatus} from '../../store/actions/app';
import { useState } from 'react';
import Voting from './Voting';
import {Nav} from 'rsuite';






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

   
    
    const addVoter = async() =>{
        await contract.methods.addVoter(address).send({from : accounts[0]});
        setAddress("");
    }

  
    

    

   
    

    return (
        <div>
            
        {status != 0 ? (
            <Voting/>

        ) :(<p className='waitMessage'>Please wait for the administrator to start the process</p>)
        }
            
        </div>
    )
}

export default Main