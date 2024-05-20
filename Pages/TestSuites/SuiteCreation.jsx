/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import MultiSelect from '../../Components/ReUsable Library/Toast/MultiSelect';
import './TestSuites.css';

const BASE_URL = 'http://localhost:8088/pwcAutomationTest';

export default function SuiteCreation({ creation, setCreation, fetcher, formData }) {
    const [suiteDetails, setSuiteDetails] = useState({
        testName: '',
        project: '',
        stepIds: [],
    });
    const [selectedTests, setSelectedTests] = useState([]);
    const multiSelectState = [selectedTests, setSelectedTests];

    // handle the closing of the creation form
    function closeCreation() {
        setCreation([false, null]);
        document.documentElement.classList.remove('hideScrollBar');
    }

    // handle the creation of a new test suite
    async function handleSuiteCreation(e) {
        e.preventDefault();
        let idsArr = [];
        selectedTests.map((test) => {
            idsArr.push(parseInt(test.match(/^\d+/)[0], 10));
        });
        setSuiteDetails(prev => ({ ...prev, stepIds: idsArr }));
        await fetch(`${BASE_URL}/newTestSuite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(suiteDetails),
        });
        fetcher.submit(formData, { method: 'POST' });
        closeCreation();
    }

    // handle the change of the form
    const handleForm = (e) => {
        const { name, value } = e.target;
        setSuiteDetails(prev => ({ ...prev, [name]: value }));
    }

    return (
        <>
            <div className='overlay'></div>
            <div className='baseCreationContainer'>
                <div className='testCaseTitle'>
                    <h1>Test Suite Creation</h1>
                    <div>
                        <button onClick={closeCreation}>
                            Back &rarr;
                        </button>
                    </div>
                </div>
                <form method="post" className='baseMessageCreationForm'>
                    <div>
                        <label htmlFor="testName" style={{ textAlign: 'start' }}>Test Name: </label>
                        <input type="text" id='testName' name='testName' value={suiteDetails.testName} onChange={handleForm}
                            placeholder='Enter your Test Name' />
                    </div>
                    <div>
                        <label htmlFor="project" style={{ textAlign: 'start' }}>Project Name: </label>
                        <input type="text" id='project' name='project' value={suiteDetails.project} onChange={handleForm}
                            placeholder='Enter your Project Name' />
                    </div>
                    <div >
                        <label htmlFor="stepIds" style={{ textAlign: 'start' }}>Please Choose the Steps: </label>
                        <MultiSelect className='maxWidthInherit' id='stepIds' options={creation[1]} multiSelectState={multiSelectState} />
                    </div>
                    <button style={{ marginBottom: '10px' }} onClick={handleSuiteCreation}>Save</button>
                </form>
            </div>
        </>
    )
}
