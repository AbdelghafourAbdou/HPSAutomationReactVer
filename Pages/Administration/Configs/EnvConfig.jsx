import { useState, useEffect } from "react";
import Toast from "../../../Components/ReUsable Library/Toast/Toast";
import { toProper } from "../../../Utils/Utils";

const BASEPATH = 'http://localhost:8088/pwcAutomationTest';

/* eslint-disable react/prop-types */
export default function EnvConfig({ dbConfig, jbossConfig }) {
    const [displayMessage, setDisplayMessage] = useState([false, null]);

    // test connection to database and jboss server
    async function handleTest(config) {
        let configType = config === 'db' ? 'DataBase' : 'ServerJboss';
        const res = await fetch(`${BASEPATH}/${configType}/isConnected`);
        const data = await res.json();
        let testTagResult = data ? 'success' : 'error';
        let testResult = data ? 'Connected' : 'Not Connected';
        setDisplayMessage([testTagResult, `${configType} is ${testResult}`]);
        return data;
    }
    // try to reconnect to database
    async function handleReConnect() {
        const res = await fetch(`${BASEPATH}/DataBase/reConnect`);
        const data = await res.json();
        let testTagResult = data ? 'success' : 'error';
        let testResult = data ? 'Succeeded' : 'Failed';
        setDisplayMessage([testTagResult, `Reconnection to DataBase has ${testResult}`]);
        return data;
    }

    // reset toasts
    useEffect(() => {
        const intervalId = setInterval(() => {
            const toast = document.getElementsByClassName('toast-container');
            if (toast.length == 0) {
                setDisplayMessage([false, null]);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className='environmentConfig'>
                <div className='config'>
                    <h1 className='configTitle'>Database Configuration</h1>
                    <p>{dbConfig.name}</p>
                    <p>{dbConfig.ipAddress}</p>
                    <p>{dbConfig.port}</p>
                    <p>{dbConfig.sid}</p>
                    <p>{dbConfig.username}</p>
                    <div className='configButtons'>
                        <button onClick={() => handleTest('db')}>Test</button>
                        <button onClick={() => handleReConnect()}>Reconnect</button>
                    </div>
                </div>
                <div className='config'>
                    <h1 className='configTitle'>Server Configuration</h1>
                    <p>{jbossConfig.name}</p>
                    <p>{jbossConfig.ipAddress}</p>
                    <p>{jbossConfig.port}</p>
                    <div className='configButtons'>
                        <button onClick={() => handleTest('jboss')}>Test</button>
                    </div>
                </div>
            </div>
            {
                displayMessage[0] !== false  &&
                <Toast event={displayMessage[0]}>
                    <p>{toProper(displayMessage[0])}</p>
                    <p>{displayMessage[1]}</p>
                </Toast >
            }
        </>
    )
}
