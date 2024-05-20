import { useState, useRef, useEffect } from 'react';
import { json } from 'react-router-dom';
import { useFetcher } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner';
import Toast from '../../Components/ReUsable Library/Toast/Toast';
import SuiteCreation from './SuiteCreation';
import info from '/infoCircle.svg';
import play from '/play.svg';
import xCircle from '/xCircle.svg';
import './TestSuites.css';

const BASE_URL = 'http://localhost:8088/pwcAutomationTest';
const size = 50;

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
    const formData = await request.formData();
    const project = formData.get('project');
    const status = formData.get('status');
    const testSuite = formData.get('testSuite');

    const req = { project, status, testSuite };
    try {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch(`${BASE_URL}/searchTestSuites?page=0&size=${size}`,
            { method: 'POST', headers, body: JSON.stringify(req) });

        if (!res.ok) {
            throw json({ message: res.statusText }, { status: res.status });
        }

        const data = await res.json();
        return data;
    } catch (error) {
        throw json({ message: 'Failed to Fetch, Server is Down.' }, { status: 503, statusText: 'Service Unavailable' });
    }

}

export default function TestSuites() {
    const formRef = useRef(null);
    const fetcher = useFetcher();
    const actionData = fetcher.data;
    const status = fetcher.state;
    const [creation, setCreation] = useState([false, null]);
    const [loaderVisibility, setLoaderVisibility] = useState(false);
    const [networkErrorToast, setNetworkErrorToast] = useState(false);

    // handle the closing of the creation form
    async function openCreation() {
        const res = await fetch(`${BASE_URL}/searchTestCases?page=0&size=100`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project: '', status: '', testCase: '', webService: '', wsVersion: '' }),
        });
        const data = await res.json();
        const filteredOptions = [];
        data.content.map(test => {
            filteredOptions.push(`${test.id} : ${test.name}`);
        });
        setCreation([true, filteredOptions]);
        document.documentElement.classList.add('hideScrollBar');
    }

    // handle button that runs the test suite
    async function handleRunTestSuite(id) {
        setLoaderVisibility(true);
        const res = await fetch(`${BASE_URL}/testSuiteRunner/${id}/REST`);
        if (res.status === 500) {
            setNetworkErrorToast(true);
        }
        const formData = new FormData(formRef.current);
        fetcher.submit(formData, { method: 'POST' });
        setLoaderVisibility(false);
    }
    // handle button that runs the test suite
    async function handleDeleteTestSuite(id) {
        setLoaderVisibility(true);
        const res = await fetch(`${BASE_URL}/deleteTestSuite/${id}`);
        if (res.status === 500) {
            setNetworkErrorToast(true);
        }
        const formData = new FormData(formRef.current);
        fetcher.submit(formData, { method: 'POST' });
        setLoaderVisibility(false);
    }

    // reset toasts
    useEffect(() => {
        const intervalId = setInterval(() => {
            const toast = document.getElementsByClassName('toast-container');
            if (toast.length == 0) {
                setNetworkErrorToast(false);
            }
        }, 100);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className='titleContainer'>
                Test Suites
            </div>
            <fetcher.Form ref={formRef} method='post' className='testSuiteFormContainer' replace>
                <div className='fieldContainer'>
                    <label htmlFor='projectSelection'>Project:</label>
                    <select id='projectSelection' name='project'>
                        <option value="" key="0">All</option>
                        <option value="COSMOTE" key="1">COSMOTE</option>
                        <option value="GOHENRY" key="2">GOHENRY</option>
                    </select>
                </div>
                <div className='fieldContainer'>
                    <label htmlFor='testSuiteSelection'>
                        Test Suite:
                    </label>
                    <input type="text" id='testSuiteSelection' name='testSuite' placeholder='Enter Test Suite' />
                </div>
                <div className='fieldContainer'>
                    <label htmlFor='statusSelection'>
                        Status:
                    </label>
                    <select id='statusSelection' name='status'>
                        <option value="" key="0">All</option>
                        <option value="PASSED" key="1">PASSED</option>
                        <option value="FAILED" key="2">FAILED</option>
                        <option value="READY" key="3">READY</option>
                    </select>
                </div>
                <div className='suiteButtons'>
                    <button disabled={status === 'submitting'}>{status === 'submitting' ? 'Searching...' : 'Search'}</button>
                    <button onClick={openCreation}>New</button>
                </div>
            </fetcher.Form>
            {actionData &&
                <>
                    <table>
                        <thead>
                            <tr key="header">
                                <th>#</th>
                                <th>Name</th>
                                <th>Project</th>
                                <th>Run Date</th>
                                <th>Time(milliseconds)</th>
                                <th>Result</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actionData?.content.map(row => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.name}</td>
                                    <td>{row.projectName}</td>
                                    <td>{row.runDate}</td>
                                    <td>{row.time}</td>
                                    <td>{row.testSuiteResult}</td>
                                    <td>{row.type}</td>
                                    <td>
                                        <div className='testCaseButtons'>
                                            <button onClick={() => handleRunTestSuite(row.id)}><img src={play} alt="Play Button" className='lightColor' /></button>
                                            <button onClick={() => handleDeleteTestSuite(row.id)}><img src={xCircle} alt="Delete Button" className='lightColor' /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {actionData?.empty &&
                        <div className='centeringDiv'>
                            <div className='testSuitesInfo'>
                                <img src={info} alt="Information Circle" className='lightColor' />
                                <h1>No Information is Being Displayed. Please Execute your Test Case.</h1>
                            </div>
                        </div>
                    }
                </>
            }
            {creation[0] && <SuiteCreation creation={creation} setCreation={setCreation} fetcher={fetcher} formData={new FormData(formRef.current)} />}
            {loaderVisibility &&
                <>
                    <div className='overlay'></div>
                    <div className='loaderSpinner'>
                        <InfinitySpin width="200" color="#3e7edf" />
                    </div>
                </>
            }
            {networkErrorToast &&
                <Toast event='error'>
                    <p>Internal Server Error</p>
                    <p>Please Check if Connection to DB is Established</p>
                </Toast>}
        </>
    )
}
