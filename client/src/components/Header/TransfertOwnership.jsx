import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux';

const TransfertOwnership = () => {

    const contract = useSelector(state => state.web3.contract);
    const accounts = useSelector(state => state.web3.accounts)

    const [address, setAddress] = useState("");

    const handleChange = (event) => {
        setAddress(event.target.value)
    }

    const changeOwner = async() => {
        await contract.methods.transferOwnership(address).call({from : accounts[0]});
        await contract.methods.transferOwnership(address).send({from : accounts[0]});
    }


    return (
        <div className="changeAdmin">
            <input type="text" placeholder='address' onChange={handleChange} value={address}/>
            <button onClick={changeOwner}>Change owner</button>
        </div>
    )
}

export default TransfertOwnership