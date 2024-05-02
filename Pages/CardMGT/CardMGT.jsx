import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLoaderData, useFetcher } from 'react-router-dom';
import xmlFormat from 'xml-formatter';
import BaseCreation from './Creation/BaseCreation';
import MSGCreation from './Creation/MSGCreation';
// import {generateConsequentNumber} from '../../Utils/Utils';
import './CardMGT.css';

const BASEPATH = 'http://localhost:8088/pwcAutomationTest/DataBase';

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
    const baseMessagesRes = await fetch(`${BASEPATH}/baseMessages`);
    const baseMessagesData = await baseMessagesRes.json();
    const MSGRes = await fetch(`${BASEPATH}/simMessages`);
    const MSGData = await MSGRes.json();
    return { baseMessagesData, MSGData };
}

export default function CardMGT() {
    const fetcher = useFetcher();
    const laoderData = useLoaderData();
    const loadedData = fetcher.data || laoderData;
    const [latestCard,] = useState(localStorage.getItem('latestCard'));
    const [results, setResults] = useState(Array(2).fill(null));
    const [baseMessageXML, setBaseMessageXML] = useState(null);
    const [MSGXML, setMSGXML] = useState(null);
    const [selectorChoice, setSelectorChoice] = useState({
        baseMessage: '',
        MSG: '',
    });
    const [isCreationOpen, setIsCreationOpen] = useState({
        baseMessage: false,
        MSG: false,
    })

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
        setResults(prev => [prev[0], null]);
        const headers = new Headers({ 'Content-Type': 'text/html' });
        const res = await fetch(`${BASEPATH}/addCardProfile?cardNumber=${latestCard}`,
            { headers });
        const data = await res.text();
        data.indexOf('<CardProfile') !== -1 ? localStorage.setItem('cardProfile', data) : null;
        setResults(prev => [prev[0], data]);
    }

    // async function handleRunSim() {
    //     setResults(prev => [...(prev.slice(0, 4)), null]);
    //     const message = {
    //         'choice' : cardMGTDetails.testId,
    //     }
    //     const headers = new Headers({ 'Content-Type': 'application/json' });
    //     await fetch(`${BASEPATH}/runSim`,
    //         { method: 'POST', headers, body: JSON.stringify(message) });
    //     setResults(prev => [...(prev.slice(0, 4)), "Simulation Done"]);
    // }

    // handle the change of selected base message or MSG file
    function handleSelectChange(e) {
        const { name, value } = e.target;
        setSelectorChoice(prev => ({ ...prev, [name]: value }));
    }
    // handle the opening of selected base message
    async function handleUseSelectedBaseMessage(baseMessageToDisplay = null) {
        setBaseMessageXML(null);
        const chosenBaseMessage = baseMessageToDisplay ? baseMessageToDisplay : selectorChoice.baseMessage;
        if (chosenBaseMessage) {
            const res = await fetch(`${BASEPATH}/baseMessage/${chosenBaseMessage}`);
            const data = await res.text();
            setBaseMessageXML(data);
        }
    }
    // handle the opening of selected MSG file
    async function handleUseSelectedMSG(MSGToDisplay = null) {
        setMSGXML(null);
        const chosenMSG = MSGToDisplay ? MSGToDisplay : selectorChoice.MSG;
        console.log(chosenMSG);
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

    useEffect(() => {
        console.log(results);
    }, [results]);

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
                    {/* <div className='controlPanelDoubleButton'>
                        <div className='controlPanelButtonContainerForm'>
                            <input type="text" name='MSGHeadline' value={cardMGTDetails.MSGHeadline}
                                onChange={handleFormDataChange} placeholder='Enter a Head Line' />
                            <button onClick={handleMSGFile}>Create MSG File</button>
                            <p>{results[3] === null ? 'No Updates' : results[3] ? 'MSG File Created Successfully' : 'MSG File Creation Failed'}</p>
                        </div>
                    </div> */}
                    {/* <div className='controlPanelButton'>
                        <input type="text" name='testId' value={cardMGTDetails.testId}
                            placeholder='Enter the Test Number to Run' onChange={handleFormDataChange} />
                        <button onClick={handleRunSim}>Run Simulator</button>
                        <p>{results[4] === null ? 'No Updates' : 'Simulation Done'}</p>
                    </div> */}
                    <div className='XMLEditor'>
                        <h1>Base Message Manipulation</h1>
                        <div className='XMLSelector'>
                            <select name='baseMessage' value={selectorChoice.baseMessage} onChange={handleSelectChange}>
                                <option value="" key='-1'>-------------------------------------------------</option>
                                {loadedData.baseMessagesData.map((baseMessage, index) =>
                                    <option value={baseMessage} key={index}>{baseMessage}</option>)}
                            </select>
                            <button onClick={() => handleUseSelectedBaseMessage()}>Use Selected</button>
                            <button onClick={handleCreateBaseMessage}>Create New</button>
                            {isCreationOpen.baseMessage &&
                                createPortal(<BaseCreation setIsCreationOpen={setIsCreationOpen} setSelectorChoice={setSelectorChoice}
                                    displayBase={handleUseSelectedBaseMessage} fetcher={fetcher} />, document.body)}
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
                                {loadedData.MSGData.map((MSG, index) =>
                                    <option value={MSG} key={index}>{MSG}</option>)}
                            </select>
                            <button onClick={() => handleUseSelectedMSG()}>Use Selected</button>
                            <button onClick={handleCreateMSG}>Create New</button>
                            {isCreationOpen.MSG &&
                                createPortal(<MSGCreation setIsCreationOpen={setIsCreationOpen} setSelectorChoice={setSelectorChoice}
                                    displayMSG={handleUseSelectedMSG} fetcher={fetcher} />, document.body)}
                        </div>
                        <div className='XMLReader'>
                            {MSGXML &&
                                <>
                                    <textarea name="XMLReader" id="XMLReader" cols="80" rows="11" value={xmlFormat(MSGXML)} readOnly={true}>
                                    </textarea>
                                    <div className='MSGControlButtons'>
                                        <button onClick={handleOpenBase}>Open Base Message</button>
                                        <button>Edit</button>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
