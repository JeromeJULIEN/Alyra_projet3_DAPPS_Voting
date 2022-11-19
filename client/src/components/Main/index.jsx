import React from 'react';
import { useSelector } from 'react-redux';
import Voting from './Voting';


const Main = () => {

    const status = useSelector(state => state.app.status)

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