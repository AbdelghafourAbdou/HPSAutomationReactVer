/* eslint-disable react/prop-types */
import { } from 'react';
import usePersist from '../../Hooks/usePersist';
import Link from './Link';
import dashboardIcon from '/dashboard.svg';
import signIcon from '/signpost.svg';
import adminIcon from '/administration.svg';
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
        //console.log(isIdSpecified, id);
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

        setOpenTab(prev => (isIdSpecified ? { ...newArray, [`isb${Number(id) + 1}Open`]: true } : prev));
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
                    <img src={dashboardIcon} alt="dashboard icon" className='buttonIcon lightColor' />
                    Dashboard
                    <Link open={openTab}>{[0, '/home', 'Global Statistics']}</Link>
                </button>
                <button className='buttonContainer' id='1' onClick={handleClick}>
                    <img src={signIcon} alt="sign icon" className='buttonIcon lightColor' />
                    API Stream
                    <Link open={openTab}>{[1, ['/home', '/projects', '/webServices', '/testCases', '/testSuites', '/cardMGT'], ['Statistics',
                        'Projects', 'Web Services', 'Test Cases', 'Test Suites', 'Card MGT']]}</Link>
                </button>
                {/* <button className='buttonContainer' id='2' onClick={handleClick}>
                    <img src={signIcon} alt="sign icon" className='buttonIcon lightColor' />
                    GUI Stream
                    <Link open={openTab}>{[2, '/home', 'Home']}</Link>
                </button>
                <button className='buttonContainer' id='3' onClick={handleClick}>
                    <img src={signIcon} alt="sign icon" className='buttonIcon lightColor' />
                    Online Stream
                    <Link open={openTab}>{[3, '/home', 'Home']}</Link>
                </button>
                <button className='buttonContainer' id='4' onClick={handleClick}>
                    <img src={signIcon} alt="sign icon" className='buttonIcon lightColor' />
                    Batch Stream
                    <Link open={openTab}>{[4, '/home', 'Home']}</Link>
                </button> */}
                <button className='buttonContainer' id='5' onClick={handleClick}>
                    <img src={adminIcon} alt="sign icon" className='buttonIcon lightColor' />
                    Administration
                    <Link open={openTab}>{[5, '/Administration', 'Gonfigurations']}</Link>
                </button>
            </nav>
        </div>
    )
}
