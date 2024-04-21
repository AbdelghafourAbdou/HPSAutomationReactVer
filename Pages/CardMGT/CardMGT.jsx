import { useState, useEffect } from 'react';
import {
    getFormattedCurrentDateTime, generateSixRandomNumbers,
    getFormattedCurrentDate, getFormattedCurrentTime,
    generateElevenNumbers, getJulianFormattedDate
} from '../../Utils/Utils';
import './CardMGT.css';

const BASEPATH = 'http://localhost:8088/pwcAutomationTest/DataBase';

export default function CardMGT() {
    const [latestCard,] = useState(localStorage.getItem('latestCard'));
    const [results, setResults] = useState(Array(4).fill(null));
    const [baseTestDetails, setBaseTestDetails] = useState({
        baseMessageStringRef: '',
        msgTypeStringRef: '',
    });

    // activate the card
    async function handleActivateCard() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch(`${BASEPATH}/activateCard?cardNumber=${latestCard}`,
            { method: 'POST', headers });
        const data = await res.json();
        setResults(prev => [data, ...(prev.slice(1))]);
    }

    // create a card profile to the XML
    async function handleCardProfile() {
        const headers = new Headers({ 'Content-Type': 'text/html' });
        const res = await fetch(`${BASEPATH}/addCardProfile?cardNumber=${latestCard}`,
            { headers });
        const data = await res.text();
        setResults(prev => [prev[0], data, ...(prev.slice(2))]);
    }

    // create a base test file for testing
    async function handleBaseTest() {
        const field11 = generateSixRandomNumbers();
        const field32 = generateElevenNumbers();
        const message = {
            '002': latestCard,
            '003': 200000,
            '004': String(40.00 * 100).padStart(12, '0'),
            '006': String(40.00 * 100).padStart(12, '0'),
            '007': getFormattedCurrentDateTime(),
            '011': field11,
            '012': getFormattedCurrentTime(),
            '013': getFormattedCurrentDate(),
            '014': 2801,
            '018': 5999,
            '019': 380,
            '022': '0210',
            '023': '001',
            '025': '00',
            '032': field32,
            '035': '',  // to be filled with a query from db
            '037': `${getJulianFormattedDate()}${field11}`,
            '041': 'TERMID01',
            '042': 'CARD ACCEPTOR  ',
            '043': 'CARD ACCEPTOR TESTDATA   CASABLANCA   MA',
            '049': 978,
            '051': 978,
            '052': '058CEFE99578CEDD',
            '053': '2001010100000000',
            '055': '0100669F3303204000950580000100009F37049BADBCAB9F1E08F9F9F9F9F9F9F9F99F100C0B010A03A0B00000000000009F26080123456789ABCDEF9F36020104820200009C01009F1A0208409A030101019F02060000000123005F2A0208409F0306000000000000',
            '060': 45,
            '062': '0000000000000000',
            '063': '8000000002',
            '090': `01000000000000000000${field32}00000000000`,
            '123': ' 10000127,Street Av'
        }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch(`${BASEPATH}/addBaseTest?baseMessageString=${baseTestDetails.baseMessageStringRef}&msgTypeString=${baseTestDetails.msgTypeStringRef}&msgHeaderString=16010200FE0000000000000000000000000000000000`,
            { method: 'POST', headers, body: JSON.stringify(message) });
        const data = await res.json();
        setResults(prev => [prev[0], prev[1], data, prev[3]]);
    }

    function handleFormDataChange(e) {
        setBaseTestDetails(prev => ({
            ...prev, [e.target.name]: e.target.value
        }));
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
                    <div className='controlPanelButton'>
                        <button onClick={handleActivateCard}>Activate Card</button>
                        <p>{results[0] === null ? 'No Updates' : results[0] ? 'Card Activated Successfully' : 'Card Activation Failed'}</p>
                    </div>
                    <div className='controlPanelButton'>
                        <button onClick={handleCardProfile}>Add Card Profile</button>
                        <p>{results[1] === null ? 'No Updates' : results[1].indexOf('<CardProfile') !== -1 ? 'Card Profile Added Successfuly' : results[1]}</p>
                    </div>
                    <div className='controlPanelButton'>
                        <input type="text" name='baseMessageStringRef' value={baseTestDetails.baseMessageStringRef}
                            onChange={handleFormDataChange} placeholder='Enter Base Test Name'/>
                        <select name='msgTypeStringRef' value={baseTestDetails.msgTypeStringRef}
                            onChange={handleFormDataChange}>
                            <option value="100" key="0">100</option>
                            <option value="120" key="1">120</option>
                            <option value="121" key="2">121</option>
                            <option value="400" key="3">400</option>
                            <option value="420" key="4">420</option>
                        </select>
                        <button onClick={handleBaseTest}>Add Base Test</button>
                        <p>{results[2] === null ? 'No Updates' : results[2] ? 'Base Test Added Successfully' : 'Base Test Addition Failed'}</p>
                    </div>
                    <div className='controlPanelButton'>
                        <button>Create MSG File</button>
                        <p>No Updates</p>
                    </div>
                </div>
            </div>
        </>
    )
}
