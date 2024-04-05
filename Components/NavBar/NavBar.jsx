/* eslint-disable react/prop-types */
import { } from 'react';
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { FaStream } from "react-icons/fa";
import usePersist from '../../Hooks/usePersist';
import Link from './Link';
import './NavBar.css';

export default function NavBar() {
    const [openTab, setOpenTab] = usePersist({
        isb1Open: false,
        isb2Open: false,
        isb3Open: false,
        isb4Open: false,
        isb5Open: false,
        isb6Open: false,
    }, 'navigation');

    function handleClick({ target }) {
        const id = target.id;
        const isIdSpecified = target.id ? true : false;
        console.log(isIdSpecified, id);
        let newArray = {
            isb1Open: false,
            isb2Open: false,
            isb3Open: false,
            isb4Open: false,
            isb5Open: false,
            isb6Open: false,
        };

        if (isIdSpecified && openTab[`isb${Number(id) + 1}Open`] === true) {
            return setOpenTab(prev => ({
                ...prev,
                [`isb${Number(id) + 1}Open`]: false,
            }));
        }

        setOpenTab(prev => (isIdSpecified ? { ...newArray, [`isb${Number(id) + 1}Open`]: true } : prev ));
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
                    <Link open={openTab}>{[0, '/home', 'Global Statistics']}</Link>
                </button>
                <button className='buttonContainer' id='1' onClick={handleClick}>
                    <i className='buttonIcon'><FaStream /></i>
                    API Stream
                    <Link open={openTab}>{[1, ['/home', '/projects', '/home', '/testCases', '/home'], ['Statistics',
                        'Projects', 'Web Services', 'Test Cases', 'Test Suits']]}</Link>
                </button>
                <button className='buttonContainer' id='2' onClick={handleClick}>
                    <i className='buttonIcon'><FaStream /></i>
                    GUI Stream
                    <Link open={openTab}>{[2, '/home', 'Home']}</Link>
                </button>
                <button className='buttonContainer' id='3' onClick={handleClick}>
                    <i className='buttonIcon'><FaStream /></i>
                    Online Stream
                    <Link open={openTab}>{[3, '/home', 'Home']}</Link>
                </button>
                <button className='buttonContainer' id='4' onClick={handleClick}>
                    <i className='buttonIcon'><FaStream /></i>
                    Batch Stream
                    <Link open={openTab}>{[4, '/home', 'Home']}</Link>
                </button>
                <button className='buttonContainer' id='5' onClick={handleClick}>
                    <i className='buttonIcon'><MdAdminPanelSettings /></i>
                    Administration
                    <Link open={openTab}>{[5, '/Administration', 'Gonfigurations']}</Link>
                </button>
            </nav>
        </div>
    )
}
