import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import EnvConfig from './Configs/EnvConfig';
import EmailConfig from './Configs/EmailConfig';
import './Administration.css';

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
    try {
        const res1 = await fetch('http://localhost:8088/pwcAutomationTest/DataBase/getConfig');
        const res2 = await fetch('http://localhost:8088/pwcAutomationTest/ServerJboss/getConfig');
        const dbConfig = await res1.json();
        const JbossConfig = await res2.json();

        return [dbConfig, JbossConfig];
    } catch (error) {
        if (error.name !== 'TypeError') {
            throw new Error(error);
        } else throw new Response({ message: 'Failed to Fetch Data, Server is Probably Down.' }, { status: 503, statusText: 'Server Unavailable' });
    }
}

export default function Administration() {
    const [dbConfig, JbossConfig] = useLoaderData();
    const [configActive, setConfigActive] = useState({
        none: true,
        environment: false,
        scheduler: false,
        email: false,
    });

    const toProper = (title) => {
        let tempArr = title.split('');
        let capitalFirstLetter = tempArr[0].toUpperCase();
        let newTitle = tempArr.toSpliced(0, 1, capitalFirstLetter).join('');
        return newTitle;
    }

    function handleConfig(key) {
        let newActive = {
            none: false,
            environment: false,
            scheduler: false,
            email: false,
        }
        setConfigActive({ ...newActive, [key]: true })
    }

    const arr = Object.entries(configActive).filter(pair => {
        // eslint-disable-next-line no-unused-vars
        const [_, value] = pair;
        return value === true;
    });
    const mode = arr[0][0] !== 'none' ? ` / ${toProper(arr[0][0])}` : null;

    return (
        <>
            <div className='titleContainer'>
                <h1>Administration{mode}</h1>
            </div>
            <div className='buttonsContainer'>
                <button onClick={() => handleConfig('environment')}>Environment Config</button>
                <button onClick={() => handleConfig('scheduler')}>Scheduler Config</button>
                <button onClick={() => handleConfig('email')}>Email Config</button>
                <button onClick={() => handleConfig('none')}>Reset</button>
            </div>
            <div className='activeProfile'>
                {configActive.environment &&
                    <EnvConfig dbConfig={dbConfig} jbossConfig={JbossConfig} />
                }
                {configActive.email &&
                    <EmailConfig />
                }
            </div>
        </>
    )
}
