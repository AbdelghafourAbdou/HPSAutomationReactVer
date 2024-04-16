/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import info from '/infoCircle.svg';
import './ViewTestCase.css'

export default function ViewTestCase({ setViewOpen, row }) {
    const [displayOption, setDisplayOption] = useState([null, null]);

    // close details page
    function handleCloseDetails() {
        setViewOpen([false, null]);
        document.documentElement.classList.remove('hideScrollBar');
    }

    // use request/response info to create readable text for debugging
    function turnInfoPrintable(info) {
        let result = '{\n';
        for (const [key, value] of Object.entries(info)) {
            if (typeof value === 'object') {
                result += ` ${key}: {\n`;
                for (const [innerKey, innerValue] of Object.entries(value)) {
                    result += `   ${innerKey}: ${innerValue},\n`;
                }
                result += '},\n';
                continue;
            }
            result += ` ${key}: ${value},\n`;
        }
        result += '}';
        return result;
    }

    // use request/response info to create readable text for debugging (this version goes 4 lvls deeper, the first has a max of 2 lvls)
    function turnInfoPrintableDeeper(info) {
        let result = '{\n';
        for (const [key, value] of Object.entries(info)) {
            if (typeof value === 'object') {
                result += ` ${key}: {\n`;
                for (const [innerKey, innerValue] of Object.entries(value)) {
                    if (typeof innerValue === 'object') {
                        result += `  ${innerKey}: {\n`;
                        for (const [secondInnerKey, secondInnerValue] of Object.entries(innerValue)) {
                            if (typeof secondInnerValue === 'object') {
                                result += `   ${secondInnerKey}: {\n`;
                                for (const [thirdInnerKey, thirdInnerValue] of Object.entries(secondInnerValue)) {
                                    if (typeof thirdInnerValue === 'object') {
                                        result += `    ${thirdInnerKey}: {\n`;
                                        for (const [fourthInnerKey, fourthInnerValue] of Object.entries(thirdInnerValue)) {
                                            result += `     ${fourthInnerKey}: ${fourthInnerValue},\n`;
                                        }
                                        result += '    },\n';
                                        continue;
                                    }
                                    result += `    ${thirdInnerKey}: ${thirdInnerValue},\n`;
                                }
                                result += '   },\n';
                                continue;
                            }
                            result += `    ${secondInnerKey}: ${secondInnerValue},\n`;
                        }
                        result += '  },\n';
                        continue;
                    }
                    result += `   ${innerKey}: ${innerValue},\n`;
                }
                result += ' },\n';
                continue;
            }
            result += ` ${key}: ${value},\n`;
        }
        result += '}';
        return result;
    }

    // set which info to display depending on the row data
    useEffect(() => {
        if (row.testCaseResult === 'READY') {
            setDisplayOption([0, null]);
        } else if (row.testCaseResult === 'PASSED') {
            setDisplayOption([1, {
                request: turnInfoPrintable(JSON.parse(row.request)),
                response: turnInfoPrintable(JSON.parse(row.response)),
                expectedResponse: turnInfoPrintable(JSON.parse(row.expectedResponse)),
            }]);
        } else if (row.testCaseResult === 'FAILED') {
            let frags = []
            row.errors.map((val) => {
                frags.push(val.split(','));
            });
            setDisplayOption([-1, {
                request: turnInfoPrintableDeeper(JSON.parse(row.request)),
                response: turnInfoPrintable(JSON.parse(row.response)),
                expectedResponse: turnInfoPrintable(JSON.parse(row.expectedResponse)),
                errors: frags,
            }]);
        }
    }, [row]);

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
                                <td>{row.moddedType}</td>
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
