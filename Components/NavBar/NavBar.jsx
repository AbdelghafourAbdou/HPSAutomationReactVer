import { useState } from 'react';
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { FaStream } from "react-icons/fa";
import Link from './Link';
import './NavBar.css';

export default function NavBar() {
    const [openTab, setOpenTab] = useState(Array(6).fill(0));

    function handleClick(e) {
        const id = e.target.id;
        let newArray = Array(6).fill(0);

        if (openTab[id]) {
            return setOpenTab(newArray);
        }

        newArray[id] = 1;
        setOpenTab(newArray);
    }

    return (
        <div className='navContainer'>
            <h1>
                HPS QA
            </h1>
            <h5 style={{ marginBottom: '5px' }}>
                PWC TEST AUTOMATION
            </h5>
            <nav className="navbar">
                <button className='buttonContainer' id='0' onClick={handleClick}>
                    <i className='buttonIcon'><MdDashboard /></i>
                    Dashboard
                    <Link open={openTab}>{[0, 'https://www.google.com/', 'Global Statistics']}</Link>
                </button>
                <button className='buttonContainer' id='1' onClick={handleClick}>
                    <i className='buttonIcon'><FaStream /></i>
                    API Stream
                    <Link open={openTab}>{[1, ['stat', 'proj', 'ws', 'tc', 'ts'], ['Statistics',
                        'Projects', 'Web Services', 'Test Cases', 'Test Suits']]}</Link>
                </button>
                <button className='buttonContainer' id='2' onClick={handleClick}>
                    <i className='buttonIcon'><FaStream /></i>
                    GUI Stream
                    <Link open={openTab}>{[2, '/', 'Lorem Ipsum']}</Link>
                </button>
                <button className='buttonContainer' id='3' onClick={handleClick}>
                    <i className='buttonIcon'><FaStream /></i>
                    Online Stream
                    <Link open={openTab}>{[3, '/', 'Lorem Ipsum']}</Link>
                </button>
                <button className='buttonContainer' id='4' onClick={handleClick}>
                    <i className='buttonIcon'><FaStream /></i>
                    Batch Stream
                    <Link open={openTab}>{[4, '/', 'Lorem Ipsum']}</Link>
                </button>
                <button className='buttonContainer' id='5' onClick={handleClick}>
                    <i className='buttonIcon'><MdAdminPanelSettings /></i>
                    Administration
                    <Link open={openTab}>{[5, '/', 'Gonfigurations']}</Link>
                </button>
            </nav>
        </div>
    )
}
