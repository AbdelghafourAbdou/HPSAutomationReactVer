import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLoaderData, useFetcher } from 'react-router-dom';
import xmlFormat from 'xml-formatter';
// import {generateConsequentNumber} from '../../Utils/Utils';
import './CardMGT.css';
import BaseCreation from './Creation/BaseCreation';

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

    // // handle the creation of MSG File using the newly created Card Profile and Base Test
    // async function handleMSGFile() {
    //     let cardProfile = localStorage.getItem('cardProfile');
    //     let baseTest = localStorage.getItem('baseTest');
    //     let consequentNumber = generateConsequentNumber();
    //     let regex = new RegExp('(?<=_)([a-zA-Z]+)(?=_)');
    //     const message = {
    //         name: `MSG_${consequentNumber}_${baseTest}`,
    //         baseTestName: baseTest,
    //         caseId: consequentNumber,
    //         sequence: Number(consequentNumber.slice(-3)),
    //         cardProfile: cardProfile.slice(19, 39),
    //         terminalProfile: 'MER_SHOP_ONUS_B1',
    //         isPlayable: 1,
    //         description: regex.exec(baseTest)[0],
    //         headLine: cardMGTDetails.MSGHeadline,
    //         rootCaseSpecValues: '',
    //     }
    //     const headers = new Headers({ 'Content-Type': 'application/json' });
    //     const res = await fetch(`${BASEPATH}/addMSG`,
    //         { method: 'POST', headers, body: JSON.stringify(message) });
    //     const data = await res.text();
    // }

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
    async function handleUseSelectedMSG() {
        setMSGXML(null);
        const chosenMSG = selectorChoice.MSG;
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
                            <button onClick={handleBaseTest}>Create Base Test</button>
                            <p>{results[2] === null ? 'No Updates' : results[2] ? 'Base Test Created Successfully' : 'Base Test Creation Failed'}</p>
                        </div>
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
                            <button onClick={handleUseSelectedMSG}>Use Selected</button>
                            <button>Create New</button>
                        </div>
                        <div className='XMLReader'>
                            {MSGXML &&
                                <>
                                    <textarea name="XMLReader" id="XMLReader" cols="80" rows="11" value={xmlFormat(MSGXML)}>
                                    </textarea>
                                    <div className='MSGControlButtons'>
                                        <button onClick={handleOpenBase}>Open Base Message</button>
                                        <button>Save</button>
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
