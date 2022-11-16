import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const Logger = () => {

    const contract = useSelector(state => state.web3.contract);
    const [oldEvents,setOldEvents] = useState([]);

    useEffect(()=> {
        if(contract !== null){
            (async () => {
                let oldEvents = await contract.getPastEvents('WorkflowStatusChange',{
                    fromBlock : 0,
                    toBlock:'latest'
                });
                let oldEventsArray=[];
                oldEvents.forEach(event => {
                    oldEventsArray.push(event.returnValues.newStatus);
                });
                setOldEvents(oldEventsArray);
                console.log("old events array =>", oldEventsArray);
            })();

        }
    },[contract])

    return (
        <>
            <div>Status change history :</div>
            <div className="list">
                <p>{oldEvents}</p>
            </div>
        </>
    )
}

export default Logger