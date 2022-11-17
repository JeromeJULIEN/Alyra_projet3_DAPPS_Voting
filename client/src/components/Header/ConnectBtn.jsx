import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Web3 from 'web3';


const ConnectBtn = () => {
    const[connectedAddress,setConnectedAddress] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const accounts = useSelector(state => state.web3.accounts);

    
    const formatETHAddress = (s, size) =>{;
        var first = s.slice(0, size + 1);
        var last = s.slice(-size);
        return first + "..." + last;
    }
    
    const connexion = async() => {
        setConnectedAddress(formatETHAddress(accounts[0],4));
        setIsConnected(true);
    }
    
    const disconnexion = () =>{
        setConnectedAddress("");
        setIsConnected(false);
    }
    
    useEffect(()=> {
        disconnexion()
    },[accounts])

    return (
        <>
            {isConnected ? (
                <>
                    <button onClick={disconnexion}>Disconnect</button>
                    <p>{connectedAddress}</p> 
                </>
            ) :(
                <button onClick={connexion}>Connect your wallet</button>
            )}
            
        </>
    )
}

export default ConnectBtn