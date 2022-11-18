import React from 'react'
import ConnectBtn from './ConnectBtn'
import './styles.scss'


const Header = () => {
  return (
    <>
      <div className="connectButton">
        <ConnectBtn/>
      </div>
      <div className='mainTitle'>CRYPTO NIGTHMARE SCENARIO AWARD</div>
    </>
    )
}

export default Header