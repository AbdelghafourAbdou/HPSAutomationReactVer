import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLoaderData, useFetcher } from 'react-router-dom';
import xmlFormat from 'xml-formatter';
import BaseCreation from './Creation/BaseCreation';
import MSGCreation from './Creation/MSGCreation';
import Toast from '../../Components/ReUsable Library/Toast/Toast';
import { generateConsequentNumber } from '../../Utils/Utils';
import './CardMGT.css';

const BASEPATH = 'http://localhost:8088/pwcAutomationTest/DataBase';

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
    const baseMessagesRes = await fetch(`${BASEPATH}/baseMessages`);
    const baseMessagesData = await baseMessagesRes.json();
    const MSGRes = await fetch(`${BASEPATH}/simMessages`);
    const MSGData = await MSGRes.json();
    const SimOptionsRes = await fetch(`${BASEPATH}/simOptions`);
    const SimOptionsData = await SimOptionsRes.json();
    return { baseMessagesData, MSGData, SimOptionsData };
}

export default function CardMGT() {
    const fetcher = useFetcher();
    const laoderData = useLoaderData();
    const loadedData = fetcher.data || laoderData;
    const [latestCard,] = useState(localStorage.getItem('latestCard'));
    const [results, setResults] = useState(Array(3).fill(null));
    const [baseMessageXML, setBaseMessageXML] = useState(null);
    const [MSGXML, setMSGXML] = useState(null);
    const [selectorChoice, setSelectorChoice] = useState({
        baseMessage: '',
        MSG: '',
        simOption: '',
    });
    const [isCreationOpen, setIsCreationOpen] = useState({
        baseMessage: false,
        MSG: false,
        MSGEdit: false,
    });
    const [successToast, setSuccessToast] = useState([false, null]);
    const [simReqState, setSimReqState] = useState('idle');

    // activate the card
    async function handleActivateCard() {
        setResults(prev => [null, ...(prev.slice(1))]);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch(`${BASEPATH}/activateCard?cardNumber=${latestCard}`,
            { method: 'POST', headers });
        const data = await res.json();
        setResults(prev => [data, ...(prev.slice(1))]);
    }

    // create a card profile to the XML
    async function handleCardProfile() {
        setResults(prev => [prev[0], null, prev[2]]);
        const headers = new Headers({ 'Content-Type': 'text/html' });
        const res = await fetch(`${BASEPATH}/addCardProfile?cardNumber=${latestCard}`,
            { headers });
        const data = await res.text();
        data.indexOf('<CardProfile') !== -1 ? localStorage.setItem('cardProfile', data) : null;
        setResults(prev => [prev[0], data, prev[2]]);
    }

    async function handleRunSim() {
        setResults(prev => [...(prev.slice(0, 2)), null]);
        if (selectorChoice.simOption) {
            const message = {
                'choice': selectorChoice.simOption.split(' : ')[0].padStart(3, '0'),
            }
            const headers = new Headers({ 'Content-Type': 'application/json' });
            setSimReqState('fetching');
            await fetch(`${BASEPATH}/runSim`,
                { method: 'POST', headers, body: JSON.stringify(message) });
            setSimReqState('idle');
            setResults(prev => [...(prev.slice(0, 2)), "Simulation Done"]);
        }
    }

    // handle the change of selected base message or MSG file
    function handleSelectChange(e) {
        const { name, value } = e.target;
        setSelectorChoice(prev => ({ ...prev, [name]: value }));
    }
    // handle the opening of selected base message
    async function handleUseSelectedBaseMessage(baseMessageToDisplay = null) {
        setBaseMessageXML(null);
        const chosenBaseMessage = baseMessageToDisplay || selectorChoice.baseMessage;
        if (chosenBaseMessage) {
            const res = await fetch(`${BASEPATH}/baseMessage/${chosenBaseMessage}`);
            const data = await res.text();
            setBaseMessageXML(data);
        }
    }
    // handle the opening of selected MSG file
    async function handleUseSelectedMSG(MSGToDisplay = null) {
        setMSGXML(null);
        const chosenMSG = MSGToDisplay || selectorChoice.MSG;
        if (chosenMSG) {
            const res = await fetch(`${BASEPATH}/simMessage/${chosenMSG}`);
            const data = await res.text();
            setMSGXML(data);
        }
    }

    // create a new base message
    function handleCreateBaseMessage() {
        setIsCreationOpen(prev => ({ ...prev, baseMessage: true }));
        document.documentElement.classList.add('hideScrollBar');
    }
    // create a new MSG file
    function handleCreateMSG() {
        setIsCreationOpen(prev => ({ ...prev, MSG: true }));
        document.documentElement.classList.add('hideScrollBar');
    }
    // edit an existing MSG file
    function handleEditMSG() {
        setIsCreationOpen(prev => ({ ...prev, MSGEdit: true }));
        document.documentElement.classList.add('hideScrollBar');
    }
    // update MSG with latest fields
    async function handleUpdateMSG() {
        let consequentNumber = generateConsequentNumber();
        const headers = new Headers({ 'Content-Type': 'application/json' });
        let message = {
            newMSGName: `MSG_${consequentNumber}_${selectorChoice.MSG.split('_').slice(2).join('_')}`,
            originalMSGName: selectorChoice.MSG,
            latestCardNumber: localStorage.getItem('latestCard'),
            latestCardProfile: localStorage.getItem('cardProfile').match(/Name="([^"]*)"/)[1],
            newCaseID: consequentNumber,
            sequence: Number(consequentNumber.slice(-3)),
        }
        const res = await fetch(`${BASEPATH}/updateMessage`,
            { method: 'POST', headers, body: JSON.stringify(message) });
        const createdMessage = await res.text();
        fetcher.load('/cardMGT');
        setSelectorChoice(prev => ({ ...prev, MSG: createdMessage }));
        handleUseSelectedMSG(createdMessage);
        setSuccessToast([true, `New MSG File Created`]);
    }
    // opens the base message mentionned in the MSG file
    async function handleOpenBase() {
        setBaseMessageXML(null);
        let regex = new RegExp('(?<=BaseTestName=")(\\w+)(?=")');
        const usedBase = MSGXML.match(regex);
        const found = usedBase[0];
        const res = await fetch(`${BASEPATH}/baseMessage/${found}`);
        const data = await res.text();
        selectorChoice.baseMessage = found;
        setBaseMessageXML(data);
    }

    // reset toasts
    useEffect(() => {
        const intervalId = setInterval(() => {
            const toast = document.getElementsByClassName('toast-container');
            if (toast.length == 0) {
                setSuccessToast(prev => [false, prev[1]]);
            }
        }, 100);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className='titleContainer'>
                Card Management
            </div>
            <div className='controlPanel'>
                <h2 className='latestCard'>Card: {latestCard ? latestCard : 'No Card Created Recently'}</h2>
                <p className='controlPanelDescription'>Please use the following buttons to run your tests: </p>
                <div className='controlPanelButtons'>
                    <div className='controlPanelDoubleButton'>
                        <div className='controlPanelButtonContainer'>
                            <button onClick={handleActivateCard}>Activate Card</button>
                            <p>{results[0] === null ? 'No Updates' : results[0] ? 'Card Activated Successfully' : 'Card Activation Failed'}</p>
                        </div>
                        <div className='controlPanelButtonContainer'>
                            <button onClick={handleCardProfile}>Add Card Profile</button>
                            <p>{results[1] === null ? 'No Updates' : results[1].indexOf('<CardProfile') !== -1 ? 'Card Profile Added Successfully' : results[1]}</p>
                        </div>
                    </div>
                    <div className='XMLEditor'>
                        <h1>Base Message Manipulation</h1>
                        <div className='XMLSelector'>
                            <select name='baseMessage' value={selectorChoice.baseMessage} onChange={handleSelectChange}>
                                <option value="" key='-1'>-------------------------------------------------</option>
                                {loadedData.baseMessagesData.map((baseMessage, index) =>
                                    <option value={baseMessage} key={index}>{baseMessage}</option>)}
                            </select>
                            <button onClick={() => handleUseSelectedBaseMessage()}>Open Selected</button>
                            <button onClick={handleCreateBaseMessage}>Create New</button>
                            {isCreationOpen.baseMessage &&
                                createPortal(<BaseCreation setIsCreationOpen={setIsCreationOpen} setSelectorChoice={setSelectorChoice}
                                    displayBase={handleUseSelectedBaseMessage} fetcher={fetcher} setSuccessToast={setSuccessToast} />, document.body)}
                        </div>
                        <div className='XMLReader'>
                            {baseMessageXML &&
                                <textarea name="XMLReader" id="XMLReader" cols="80" rows="11" value={xmlFormat(baseMessageXML)} readOnly={true}>
                                </textarea>
                            }
                        </div>
                    </div>
                    <div className='XMLEditor'>
                        <h1>Message Manipulation</h1>
                        <div className='XMLSelector'>
                            <select name='MSG' value={selectorChoice.MSG} onChange={handleSelectChange}>
                                <option value="" key='-1'>-------------------------------------------------</option>
                                {loadedData.MSGData.map((MSG, index) => {
                                    let parsedMSG = JSON.parse(MSG);
                                    return <option value={parsedMSG[0]} key={index}>{parsedMSG[1]}</option>;
                                })}
                            </select>
                            <button onClick={() => handleUseSelectedMSG()}>Open Selected</button>
                            <button onClick={handleCreateMSG}>Create New</button>
                            {isCreationOpen.MSG &&
                                createPortal(<MSGCreation setIsCreationOpen={setIsCreationOpen} setSelectorChoice={setSelectorChoice}
                                    displayMSG={handleUseSelectedMSG} fetcher={fetcher} oldData='' setSuccessToast={setSuccessToast} />, document.body)}
                        </div>
                        <div className='XMLReader'>
                            {MSGXML &&
                                <>
                                    <textarea name="XMLReader" id="XMLReader" cols="80" rows="11" value={xmlFormat(MSGXML)} readOnly={true}>
                                    </textarea>
                                    <div className='MSGControlButtons'>
                                        <button onClick={handleOpenBase}>Open Base Message</button>
                                        <button onClick={handleUpdateMSG}>Update Message</button>
                                        <button onClick={handleEditMSG}>Edit</button>
                                    </div>
                                    {isCreationOpen.MSGEdit &&
                                        createPortal(<MSGCreation setIsCreationOpen={setIsCreationOpen} setSelectorChoice={setSelectorChoice}
                                            displayMSG={handleUseSelectedMSG} fetcher={fetcher} oldData={MSGXML} setSuccessToast={setSuccessToast} />, document.body)}
                                </>
                            }
                        </div>
                    </div>
                    <div className='XMLEditor'>
                        <h1>Simulator Manipulation</h1>
                        <div className='XMLSelector' >
                            <select id='simRunner' name='simOption' value={selectorChoice.simOption} onChange={handleSelectChange}>
                                <option value="" key='-1'>-------------------------------------------------</option>
                                {loadedData.SimOptionsData.map((simOption, index) =>
                                    <option value={simOption} key={index}>{simOption}</option>)}
                            </select>
                            <button onClick={handleRunSim} disabled={simReqState === 'fetching'} >Run Simulator</button>
                            <p className='centeringDiv' id='simResult'>
                                {results[2] === null && simReqState === 'idle' ? 'No Updates'
                                    : results[2] === null && simReqState === 'fetching' ? 'Running...' : results[2]}
                            </p>
                        </div>
                    </div>
                </div>
                {successToast[0] &&
                    <Toast event='success'>
                        <p>Success</p>
                        <p>{successToast[1]}</p>
                    </Toast>
                }
            </div>
        </>
    )
}
