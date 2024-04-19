/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Toast from '../../Components/ReUsable Library/Toast/Toast';
import xmlFormat from 'xml-formatter';
import info from '/infoCircle.svg';
import './ViewTestCase.css';

export default function ViewTestCase({ setViewOpen, row }) {
    const [displayOption, setDisplayOption] = useState([null, null]);
    const [createdCard, setCreatedCard] = useState(null);

    // close details page
    function handleCloseDetails() {
        setViewOpen([false, null]);
        document.documentElement.classList.remove('hideScrollBar');
    }

    // use request/response info to create readable text for debugging
    function turnInfoPrintable(info, indent = '') {
        let result = '{\n';
        for (const [key, value] of Object.entries(info)) {
            result += `${indent} ${key}: `;
            if (typeof value === 'object' && value) {
                result += `${turnInfoPrintable(value, `${indent} `)},\n`;
            } else {
                result += `${value},\n`;
            }
        }
        result += `${indent}}`;
        return result;
    }

    // set which info to display depending on the row data
    useEffect(() => {
        if (row.testCaseResult === 'READY') {
            setDisplayOption([0, null]);
        } else if (row.testCaseResult === 'PASSED') {
            if (row.type === 'REST') {
                setDisplayOption([1, {
                    request: turnInfoPrintable(JSON.parse(row.request)),
                    response: turnInfoPrintable(JSON.parse(row.response)),
                    expectedResponse: turnInfoPrintable(JSON.parse(row.expectedResponse)),
                }]);
                row.name === 'CreateDebitCard-Success' && setCreatedCard(JSON.parse(row.response).cardNumber);
            } else if (row.type === 'SOAP') {
                setDisplayOption([1, {
                    request: xmlFormat(row.request),
                    response: xmlFormat(row.response),
                    expectedResponse: xmlFormat(row.expectedResponse),
                }]);
                if (row.name === 'CreateDebitCard-Success') {
                    let parser = new DOMParser().parseFromString(row.response, 'text/xml');
                    setCreatedCard(parser.getElementsByTagName('CardNumber')[0].textContent);
                }
            }
        } else if (row.testCaseResult === 'FAILED') {
            let frags = []
            row.errors.map((val) => {
                frags.push(val.split(','));
            });
            (row.type === 'REST' &&
                setDisplayOption([-1, {
                    request: turnInfoPrintable(JSON.parse(row.request)),
                    response: turnInfoPrintable(JSON.parse(row.response)),
                    expectedResponse: turnInfoPrintable(JSON.parse(row.expectedResponse)),
                    errors: frags,
                }]));
            (row.type === 'SOAP' &&
                setDisplayOption([-1, {
                    request: xmlFormat(row.request),
                    response: xmlFormat(row.response),
                    expectedResponse: xmlFormat(row.expectedResponse),
                    errors: frags,
                }]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row]);

    // set the latestCard var in localStorage to the newest created card
    useEffect(() => {
        localStorage.setItem('latestCard', createdCard);
    }, [createdCard]);

    return (
        <>
            <div className='overlay'></div>
            <div className={`viewTestCaseContainer`} style={{ top: row.testCaseResult === 'READY' ? '20%' : row.testCaseResult === 'PASSED' ? '8%' : '1%', bottom: row.testCaseResult === 'READY' ? 'unset' : null }} >
                <div className='testCaseTitle'>
                    <h1>Test Case Details</h1>
                    <button onClick={handleCloseDetails}>
                        Back &rarr;
                    </button>
                </div>
                <div>
                    <table className='testCaseDetailsTable'>
                        <thead>
                            <tr key="tableHeader">
                                <th>ID</th>
                                <th>TYPE</th>
                                <th>TESTCASE</th>
                                <th>PROJECT</th>
                                <th>DATE</th>
                                <th>STATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key="testCaseDetails">
                                <td>{row.id}</td>
                                <td>{row.testCaseResult === 'READY' ? row.moddedType : row.type}</td>
                                <td>{row.name}</td>
                                <td>{row.projectName}</td>
                                <td>{row.moddedRunTime}</td>
                                <td>{row.testCaseResult}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='errorsContainer'>
                        {displayOption[0] === -1 &&
                            displayOption[1]['errors'].map((val, i) => {
                                return <div key={i}>{val.map((innerVal, innerI) => {
                                    return <p key={innerI}>{innerVal}</p>
                                })}</div>;
                            })}
                    </div>
                </div>
                {(displayOption[0] === 0) &&
                    <div className='testCaseDetailsInfoREADY'>
                        <img src={info} alt="Information Circle" className='lightColor' />
                        <h1>No Information is Being Displayed. Please Execute your Test Case.</h1>
                    </div>}
                {(displayOption[0] === 1) &&
                    <div className='testCaseDetailsInfoPASSED'>
                        <div >
                            <div className='reqresTitleContainer'>
                                <h1>REQUEST DETAILS</h1>
                                <h4>The Request Content</h4>
                            </div>
                            <pre>
                                {displayOption[1]['request']}
                            </pre>
                        </div>
                        <div >
                            <div className='reqresTitleContainer'>
                                <h1>RESPONSE DETAILS</h1>
                                <h4>The Response Content</h4>
                            </div>
                            <pre>
                                {displayOption[1]['response']}
                            </pre>
                        </div>
                        <div >
                            <div className='reqresTitleContainer'>
                                <h1>EXPECTED RESPONSE</h1>
                                <h4>The Response Content</h4>
                            </div>
                            <pre className='expectedResponse'>
                                {displayOption[1]['expectedResponse']}
                            </pre>
                        </div>
                        {row.name === 'CreateDebitCard-Success' &&
                            <Toast event='success'>
                                <p>Latest Card Creation Success</p>
                                <p>Latest Card Created: {createdCard}</p>
                            </Toast>}
                    </div>}
                {(displayOption[0] === -1) &&
                    <div className='testCaseDetailsInfoFAILED'>
                        <div >
                            <div className='reqresTitleContainer'>
                                <h1>REQUEST DETAILS</h1>
                                <h4>The Request Content</h4>
                            </div>
                            <pre>
                                {displayOption[1]['request']}
                            </pre>
                        </div>
                        <div >
                            <div className='reqresTitleContainer'>
                                <h1>RESPONSE DETAILS</h1>
                                <h4>The Response Content</h4>
                            </div>
                            <pre>
                                {displayOption[1]['response']}
                            </pre>
                        </div>
                        <div >
                            <div className='reqresTitleContainer'>
                                <h1>EXPECTED RESPONSE</h1>
                                <h4>The Response Content</h4>
                            </div>
                            <pre className='expectedResponse'>
                                {displayOption[1]['expectedResponse']}
                            </pre>
                        </div>
                    </div>}
            </div>
        </>
    )
}
