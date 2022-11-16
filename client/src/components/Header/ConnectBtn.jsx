import React from 'react'
import { useState } from 'react';
import Web3 from 'web3';


const ConnectBtn = () => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")

    const[connectedAddress,setConnectedAddress] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const formatETHAddress = (s, size) =>{;
        var first = s.slice(0, size + 1);
        var last = s.slice(-size);
        return first + "..." + last;
    }

    const connexion = async() => {
        const addr = await web3.eth.requestAccounts()
        setConnectedAddress(formatETHAddress(addr.toString(),4));
        setIsConnected(true);
    }

    const disconnexion = () =>{
        setConnectedAddress("");
        setIsConnected(false);
    }

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