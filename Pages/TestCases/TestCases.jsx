import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFetcher, useSearchParams, json } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner';
import ViewTestCase from './ViewTestCase';
import eye from '/eye.svg';
import play from '/play.svg';
import './TestCases.css';

const BASE_URL = 'http://localhost:8088/pwcAutomationTest';
const size = 6;
document.documentElement.classList.remove('hideScrollBar');

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
    const formData = await request.formData();
    const project = formData.get('project');
    const status = formData.get('status');
    const testCase = formData.get('testCase');
    const webService = formData.get('webService');
    const wsVersion = formData.get('wsVersion');

    const requestURL = new URL(request.url).toString();
    const questionMark = requestURL.indexOf('page');
    const extractedInfo = requestURL.slice(questionMark + 5);
    let pageNumber = isNaN(extractedInfo) ? 0 : extractedInfo;

    const req = { project, status, testCase, webService, wsVersion };
    try {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch(`${BASE_URL}/searchTestCases?page=${pageNumber}&size=${size}`,
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

export default function TestCases() {
    const formRef = useRef(null);
    const [, setSearchParams] = useSearchParams();
    const fetcher = useFetcher();
    const actionData = fetcher.data;
    const status = fetcher.state;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const data = actionData?.content || [];
    const pageNumber = Number(actionData?.pageable?.pageNumber) || 0;
    const totalPages = actionData?.totalPages || null;
    const [type, setType] = useState(Array(size).fill('REST'));
    const [runTime, setRunTime] = useState(Array(size).fill(''));
    const [viewOpen, setViewOpen] = useState([false, null]);
    const [loaderVisibility, setLoaderVisibility] = useState(false);
    const [firstView, setFirstView] = useState(Array(size).fill(true));

    // swap from REST to SOAP and vice-versa
    function handleTypeChange(row) {
        const id = row.id;
        setType(prev => {
            let newArr = [...prev];
            if (row.testCaseResult !== 'READY' && firstView[(id - 1) % size]) {
                newArr[(id - 1) % size] = row.type === 'REST' ? 'SOAP' : 'REST';
                return newArr;
            }
            newArr[(id - 1) % size] = newArr[(id - 1) % size] === 'REST' ? 'SOAP' : 'REST';
            return newArr;
        });
        setFirstView(prev => {
            let newArr = [...prev];
            newArr[(id - 1) % size] = false;
            return newArr;
        });
    }

    // handle navigation
    function handleArrowClick(direction) {
        setSearchParams(prev => {
            let search = new URLSearchParams(prev);
            let newPageNumber = pageNumber === 0 && Number(direction) === -1 ? pageNumber
                : pageNumber === (Number(totalPages) - 1) && Number(direction) === 1 ? pageNumber
                    : pageNumber + Number(direction);
            search.set('page', newPageNumber);
            return search;
        });
        const formData = new FormData(formRef.current);
        fetcher.submit(formData, { method: 'POST' });
        setType(Array(size).fill('REST'));
        setRunTime(Array(size).fill(''));
    }

    // handle button that views the previous test case run
    function handleViewTestCase(row) {
        document.documentElement.classList.add('hideScrollBar');
        let moddedType = type[(row.id - 1) % size];
        let moddedRunTime = runTime[(row.id - 1) % size] && runTime[(row.id - 1) % size].toLocaleString();
        let moddedRow = { ...row, moddedType, moddedRunTime };
        setViewOpen([true, moddedRow]);
    }

    // handle button that runs the test case
    async function handleRunTestCase(row) {
        setLoaderVisibility(true);
        const res = await fetch(`${BASE_URL}/testCaseRunner/${row.id}/${type[(row.id - 1) % size]}`);
        const data = await res.json();
        console.log(data);
        setLoaderVisibility(false);
        const formData = new FormData(formRef.current);
        fetcher.submit(formData, { method: 'POST' });
        let moddedType = data.type;
        data.runDate = new Date(data.runDate);
        let moddedRunTime = data.runDate.toLocaleString();
        data?.status !== 500 ? setViewOpen([true, { ...data, moddedType, moddedRunTime }]) : null;
    }

    // converts the db time into more readable format
    useEffect(() => {
        if (data.length > 0) {
            let newArr = data.map((row) => {
                return row.runDate = row.runDate ? new Date(row.runDate) : row.runDate;
            });
            setRunTime(newArr);
        }
    }, [data]);

    return (
        <div id='testCasesContainer' >
            <div className='titleContainer'>
                <h1>Test Cases</h1>
            </div>
            <fetcher.Form ref={formRef} method='post' className='testCaseFormContainer' replace>
                <div className='fieldContainer'>
                    <label htmlFor='projectSelection'>
                        Project:
                    </label>
                    <select id='projectSelection' name='project'>
                        <option value="" key="0">All</option>
                        <option value="COSMOTE" key="1">COSMOTE</option>
                        <option value="GOHENRY" key="2">GOHENRY</option>
                    </select>
                </div>
                <div className='fieldContainer'>
                    <label>
                        Web Service:
                    </label>
                    <input type="text" name='webService' placeholder='Enter Web Service' />
                </div>
                <div className='fieldContainer'>
                    <label>
                        Ws Version:
                    </label>
                    <input type="text" name='wsVersion' placeholder='Enter Version' />
                </div>
                <div className='fieldContainer'>
                    <label>
                        Test Case:
                    </label>
                    <input type="text" name='testCase' placeholder='Enter Test Case' />
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
                <button disabled={status === 'submitting'}>{status === 'submitting' ? 'Searching...' : 'Search'}</button>
            </fetcher.Form>
            {actionData &&
                <>
                    <table className='testCasesTable' id='testCasesTable'>
                        <thead>
                            <tr key="header">
                                <th>#</th>
                                <th>Name</th>
                                <th>WS Name</th>
                                <th>Project Name</th>
                                <th>WS Version</th>
                                <th>Run Date</th>
                                <th>Result</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row =>
                                    <tr key={`data row ${row.id}`}>
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.webServiceName}</td>
                                        <td>{row.projectName}</td>
                                        <td>{row.wsVersion}</td>
                                        <td>{runTime[(row.id - 1) % size] && runTime[(row.id - 1) % size].toLocaleString()}</td>
                                        <td>{row.testCaseResult}</td>
                                        <td>
                                            <button onClick={() => handleTypeChange(row)}>
                                                {firstView[(row.id - 1) % size] && row.testCaseResult !== 'READY' ? row.type : type[(row.id - 1) % size]}
                                            </button>
                                        </td>
                                        <td>
                                            <div className='testCaseButtons'>
                                                <button onClick={() => handleViewTestCase(row)} >
                                                    <img src={eye} alt="View Button" className='lightColor' />
                                                </button>
                                                <button onClick={() => handleRunTestCase(row)} >
                                                    <img src={play} alt="Play Button" className='lightColor' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                            )}
                        </tbody>
                    </table>
                    {viewOpen[0] && createPortal(<ViewTestCase setViewOpen={setViewOpen} row={viewOpen[1]} />, document.getElementById('testCasesContainer'))}
                    {loaderVisibility &&
                        <>
                            <div className='overlay'></div>
                            <div className='loaderSpinner'>
                                <InfinitySpin width="200" color="#3e7edf" />
                            </div>
                        </>
                    }
                    <div className='pagingControl'>
                        {totalPages && <button onClick={() => handleArrowClick(-1)}>&larr;</button>}
                        {pageNumber + 1}{totalPages ? ` / ${totalPages}` : ''}
                        {totalPages && <button onClick={() => handleArrowClick(1)}>&rarr;</button>}
                    </div>
                </>
            }
        </div>
    )
}
