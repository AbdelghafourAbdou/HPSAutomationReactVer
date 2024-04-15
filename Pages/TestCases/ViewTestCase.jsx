/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import info from '/infoCircle.svg';
import './ViewTestCase.css'

export default function ViewTestCase({ setViewOpen, row }) {
    const [displayOption, setDisplayOption] = useState([null, null]);

    // close details page
    function handleCloseDetails() {
        setViewOpen([false, null]);
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

    // set which info to display depending on the row data
    useEffect(() => {
        //console.log(row);
        let info = { "providerLogin": "soufiane", "providerPassword": "$2a$10$8ry3EGRY85RwLhHz2AmvI.UNYe5fzGaodCRnvrTQTRJ7RFjfkLdna", "requestInfo": { "requestDate": "2024-04-15T23:27:00", "requestUID": "0635fc22-43e4-4798-b8d5-ec507576a2b9", "userID": "soufiane" }, "userLanguage": "en_US" };
        console.log(turnInfoPrintable(info));
        if (row.testCaseResult === 'READY') {
            setDisplayOption([0, null]);
        } else if (row.testCaseResult === 'PASSED') {
            setDisplayOption([1, { 
                request: turnInfoPrintable(row.request),
                response: turnInfoPrintable(row.response),
                expectedResponse: turnInfoPrintable(row.expectedResponse),
            }]);
        } else if (row.testCaseResult === 'FAILED') {
            setDisplayOption([-1, null]);
        }
    }, [row]);

    return (
        <>
            <div className='overlay'></div>
            <div className='viewTestCaseContainer'>
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
                </div>
                {(displayOption[0] === 0) &&
                    <div className='testCaseDetailsInfoREADY'>
                        <img src={info} alt="Information Circle" className='lightColor' />
                        <h1>No Information is Being Displayed. Please Execute your Test Case.</h1>
                    </div>}
                {(displayOption[0] === 1) &&
                    <div className='testCaseDetailsInfoPASSED'>
                        <div>
                            <h1>REQUEST DETAILS</h1>
                            <h4>The Request Content</h4>
                            {displayOption[1]['request']}
                        </div>
                        <div>
                            <h1>RESPONSE DETAILS</h1>
                            <h4>The Response Content</h4>
                            {displayOption[1]['response']}
                        </div>
                        <div>
                            <h1>EXPECTED RESPONSE</h1>
                            <h4>The Response Content</h4>
                            {displayOption[1]['expectedResponse']}
                        </div>
                    </div>}
                {(displayOption[0] === -1) &&
                    <div className='testCaseDetailsInfoFAILED'>
                        <img src={info} alt="Information Circle" className='lightColor' />
                        <h1>No Information is Being Displayed. Please Execute your Test Case.</h1>
                    </div>}
            </div>
        </>
    )
}
