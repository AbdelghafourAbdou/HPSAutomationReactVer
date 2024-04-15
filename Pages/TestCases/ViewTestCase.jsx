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
        if (row.errors.length < 1 && !row.request && !row.response && !row.expectedResponse) {
            setDisplayOption(0);
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
                    <div className='testCaseDetailsInfo'>
                        <img src={info} alt="Information Circle" className='lightColor' />
                        <h1>No Information is Being Displayed. Please Execute your Test Case.</h1>
                    </div>
                }
            </div>
        </>
    )
}
