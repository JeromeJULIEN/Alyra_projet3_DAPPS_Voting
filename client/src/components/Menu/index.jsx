import React, { useState } from 'react'
import {Nav} from 'rsuite';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "./styles.scss";

const Menu = () => {

    const [active, setActive] = useState('Voters');
    const {accounts,owner} = useSelector(state => state.web3);

    return (
        <div className="menu">
            <Nav appearance='tabs' active={active} onSelect={setActive}>
                <Nav.Item eventKey="Voters"><Link to="/">Voters</Link> </Nav.Item>
                {accounts[0] === owner ? (
                    <Nav.Item eventKey="Admin"><Link to="/admin">Admin</Link></Nav.Item>

                ):(<></>)}
            </Nav>
        </div>
    )
}

export default Menu