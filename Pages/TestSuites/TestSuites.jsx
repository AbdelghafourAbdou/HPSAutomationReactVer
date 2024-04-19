import { } from 'react';
import { json } from 'react-router-dom';
import { useFetcher } from 'react-router-dom';
import info from '/infoCircle.svg';
import './TestSuites.css';

const BASE_URL = 'http://localhost:8088/pwcAutomationTest';
const size = 6;

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
    const fetcher = useFetcher();
    const actionData = fetcher.data;
    const status = fetcher.state;

    return (
        <>
            <div className='titleContainer'>
                Test Suites
            </div>
            <fetcher.Form method='post' className='testSuiteFormContainer' replace>
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
                <button disabled={status === 'submitting'}>{status === 'submitting' ? 'Searching...' : 'Search'}</button>
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
        </>
    )
}
