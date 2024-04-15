/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import info from '/infoCircle.svg';
import './ViewTestCase.css'

export default function ViewTestCase({ setViewOpen, row }) {
    const [displayOption, setDisplayOption] = useState(null);

    // close details page
    function handleCloseDetails() {
        setViewOpen([false, null]);
    }

    // set which info to display depending on the row data
    useEffect(() => {
        //console.log(row);
        if (row.testCaseResult === 'READY') {
            setDisplayOption(0);
        } else if (row.testCaseResult === 'PASSED')  {
            setDisplayOption(1);
        } else if (row.testCaseResult === 'FAILED') {
            setDisplayOption(-1);
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
                {(displayOption === 0) &&
                    <div className='testCaseDetailsInfoREADY'>
                        <img src={info} alt="Information Circle" className='lightColor' />
                        <h1>No Information is Being Displayed. Please Execute your Test Case.</h1>
                    </div>}
                {(displayOption === 1) &&
                    <div className='testCaseDetailsInfoPASSED'>
                        <div>
                            <h1>REQUEST DETAILS</h1>
                            <h4>The Request Content</h4>
                            {row.request}
                        </div>
                        <div>
                            <h1>RESPONSE DETAILS</h1>
                            <h4>The Response Content</h4>
                            {row.response}
                        </div>
                        <div>
                            <h1>EXPECTED RESPONSE</h1>
                            <h4>The Response Content</h4>
                            {row.expectedResponse}
                        </div>
                    </div>}
                {(displayOption === -1) &&
                    <div className='testCaseDetailsInfoFAILED'>
                        <img src={info} alt="Information Circle" className='lightColor' />
                        <h1>No Information is Being Displayed. Please Execute your Test Case.</h1>
                    </div>}
            </div>
        </>
    )
}
