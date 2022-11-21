import React from 'react'
import ConnectBtn from './ConnectBtn'
import './styles.scss'
import TransfertOwnership from './TransfertOwnership'


const Header = () => {
  return (
    <>
      <div className="connectButton">
        <TransfertOwnership/>
        <ConnectBtn/>
      </div>
      <div className='mainTitle'>CRYPTO NIGTHMARE SCENARIO AWARD 2022 !!! </div>
    </>
    )
}

export default Header