import { Form, useActionData, useNavigation } from 'react-router-dom';
import './TestCases.css'

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
    const formData = await request.formData();
    const project = formData.get('project');
    const status = formData.get('status');
    const testCase = formData.get('testCase');
    const webService = formData.get('webService');
    const wsVersion = formData.get('wsVersion');

    const req = { project, status, testCase, webService, wsVersion };
    try {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch('http://localhost:8088/pwcAutomationTest/searchTestCases?page=0&size=6',
            { method: 'POST', headers, body: JSON.stringify(req) });

        if (!res.ok) {
            throw new Error;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        return error.message;
    }
}

export default function TestCases() {
    const actionData = useActionData();
    console.log(actionData)
    const navigate = useNavigation();
    const status = navigate.state;

    return (
        <>
            <div className='titleContainer'>
                <h1>Test Cases</h1>
            </div>
            <Form method='post' className='testCaseFormContainer' replace>
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
            </Form>
            {actionData &&
                <>
                    <table className='testCasesTable'>
                        <thead>
                            <tr key="header">
                                <th>#</th>
                                <th>Name</th>
                                <th>WS Name</th>
                                <th>Project Name</th>
                                <th>PWC Version</th>
                                <th>WS Version</th>
                                <th>Run Date</th>
                                <th>Result</th>
                                <th>Type</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {actionData.content.map(row =>
                                <tr key={`data row ${row.id}`}>
                                    <td>{row.id}</td>
                                    <td>{row.name}</td>
                                    <td>{row.webServiceName}</td>
                                    <td>{row.projectName}</td>
                                    <td>{row.pwcVersion}</td>
                                    <td>{row.wsVersion}</td>
                                    <td>{row.runDate}</td>
                                    <td>{row.testCaseResult}</td>
                                    <td>{row.type}</td>
                                    <td>
                                        <button >
                                            chi7aja
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            }
        </>
    )
}
