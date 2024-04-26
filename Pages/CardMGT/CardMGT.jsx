import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import xmlFormat from 'xml-formatter';
// import {
//     getFormattedCurrentDateTime, generateSixRandomNumbers,
//     getFormattedCurrentDate, getFormattedCurrentTime,
//     generateElevenNumbers, getJulianFormattedDate,
//     toProperMultipleWords, generateConsequentNumber
// } from '../../Utils/Utils';
import './CardMGT.css';

const BASEPATH = 'http://localhost:8088/pwcAutomationTest/DataBase';

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
    const res = await fetch(`${BASEPATH}/baseMessages`);
    const data = await res.json();
    return data;
}

export default function CardMGT() {
    const laoderData = useLoaderData();
    const [latestCard,] = useState(localStorage.getItem('latestCard'));
    const [results, setResults] = useState(Array(5).fill(null));
    // const [cardMGTDetails, setCardMGTDetails] = useState({
    //     amount: 0,
    //     baseMessageStringRef: '',
    //     msgTypeStringRef: '',
    //     MSGHeadline: '',
    //     testId: null,
    // });
    const [selectorChoice, setSelectorChoice] = useState({
        baseMessage: '',
        MSG: '',
    });
    const [baseMessageXML, setBaseMessageXML] = useState(null);

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
        setResults(prev => [prev[0], null, ...(prev.slice(2))]);
        const headers = new Headers({ 'Content-Type': 'text/html' });
        const res = await fetch(`${BASEPATH}/addCardProfile?cardNumber=${latestCard}`,
            { headers });
        const data = await res.text();
        data.indexOf('<CardProfile') !== -1 ? localStorage.setItem('cardProfile', data) : null;
        setResults(prev => [prev[0], data, ...(prev.slice(2))]);
    }

    // // create a base test file for testing
    // async function handleBaseTest() {
    //     setResults(prev => [prev[0], prev[1], null, prev[3], prev[4]]);
    //     const field11 = generateSixRandomNumbers();
    //     const field32 = generateElevenNumbers();
    //     const message = {
    //         '002': latestCard,
    //         '003': 200000,
    //         '004': String(cardMGTDetails.amount).padStart(12, '0'),
    //         '006': String(cardMGTDetails.amount).padStart(12, '0'),
    //         '007': getFormattedCurrentDateTime(),
    //         '011': field11,
    //         '012': getFormattedCurrentTime(),
    //         '013': getFormattedCurrentDate(),
    //         '014': 2801,
    //         '018': 5999,
    //         '019': 380,
    //         '022': '0210',
    //         '023': '001',
    //         '025': '00',
    //         '032': field32,
    //         '035': '',  // to be filled with a query from db
    //         '037': `${getJulianFormattedDate()}${field11}`,
    //         '041': 'TERMID01',
    //         '042': 'CARD ACCEPTOR  ',
    //         '043': 'CARD ACCEPTOR TESTDATA   CASABLANCA   MA',
    //         '049': 978,
    //         '051': 978,
    //         '052': '058CEFE99578CEDD',
    //         '053': '2001010100000000',
    //         '055': '0100669F3303204000950580000100009F37049BADBCAB9F1E08F9F9F9F9F9F9F9F99F100C0B010A03A0B00000000000009F26080123456789ABCDEF9F36020104820200009C01009F1A0208409A030101019F02060000000123005F2A0208409F0306000000000000',
    //         '060': 45,
    //         '062': '0000000000000000',
    //         '063': '8000000002',
    //         '090': `01000000000000000000${field32}00000000000`,
    //         '123': ' 10000127,Street Av'
    //     }
    //     const headers = new Headers({ 'Content-Type': 'application/json' });
    //     const res = await fetch(`${BASEPATH}/addBaseTest?baseMessageString=${toProperMultipleWords(cardMGTDetails.baseMessageStringRef)}&msgTypeString=${String(cardMGTDetails.msgTypeStringRef).padStart(4, '0')}&msgHeaderString=16010200FE0000000000000000000000000000000000`,
    //         { method: 'POST', headers, body: JSON.stringify(message, Object.keys(message).sort()) });
    //     const data = await res.text();
    //     const regex = new RegExp('\\d{3}_\\w+', 'g');
    //     regex.test(data) ? localStorage.setItem('baseTest', data) : null;
    //     setResults(prev => [prev[0], prev[1], data, prev[3], prev[4]]);
    // }

    // // handle the input fields change
    // function handleFormDataChange(e) {
    //     let { name, value } = e.target;
    //     if (name === 'amount') {
    //         value = Number(value);
    //         if (!Number.isInteger(value)) {
    //             value = Math.round(value * 100) / 100
    //         }
    //         value *= 100;
    //     }
    //     setCardMGTDetails(prev => ({
    //         ...prev, [name]: value
    //     }));
    // }

    // // handle the creation of MSG File using the newly created Card Profile and Base Test
    // async function handleMSGFile() {
    //     setResults(prev => [prev[0], prev[1], prev[2], null, prev[4]]);
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
    //     setResults(prev => [prev[0], prev[1], prev[2], data, prev[4]]);
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

    function handleSelectChange(e) {
        const { name, value } = e.target;
        setSelectorChoice(prev => ({ ...prev, [name]: value }));
    }
    async function handleUseSelectedBaseMessage() {
        setBaseMessageXML(null);
        const chosenBaseMessage = selectorChoice.baseMessage;
        const res = await fetch(`${BASEPATH}/baseMessage/${chosenBaseMessage}`);
        const data = await res.text();
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
                            <input type="number" name='amount' step="0.01"
                                onChange={handleFormDataChange} placeholder='Enter the Amount in €' />
                            <input type="text" name='baseMessageStringRef' value={cardMGTDetails.baseMessageStringRef}
                                onChange={handleFormDataChange} placeholder='Enter Base Test Name' />
                            <select name='msgTypeStringRef' value={cardMGTDetails.msgTypeStringRef}
                                onChange={handleFormDataChange}>
                                <option value="" key="-1">-----</option>
                                <option value="100" key="0">100</option>
                                <option value="120" key="1">120</option>
                                <option value="121" key="2">121</option>
                                <option value="400" key="3">400</option>
                                <option value="420" key="4">420</option>
                            </select>
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
                        <div className='XMLSelector'>
                            <select name='baseMessage' value={selectorChoice.baseMessage} onChange={handleSelectChange}>
                                <option value="" key='-1'>-------------------------------------------------</option>
                                {laoderData.map((baseMessage, index) =>
                                    <option value={baseMessage} key={index}>{baseMessage}</option>)}
                            </select>
                            <button onClick={handleUseSelectedBaseMessage}>Use Selected</button>
                            <button>Create New</button>
                        </div>
                        <div className='XMLReader'>
                            {baseMessageXML &&
                                    <textarea name="XMLReader" id="XMLReader" cols="80" rows="11">
                                        {xmlFormat(baseMessageXML)}
                                    </textarea>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
