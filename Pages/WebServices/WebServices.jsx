import { } from 'react';
import { Form, useActionData, useNavigation } from 'react-router-dom';
import './WebServices.css';

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
    const formData = await request.formData();
    const project = formData.get('project');
    const webService = formData.get('webService');
    const wsVersion = formData.get('wsVersion');

    const req = { project, webService, wsVersion };
    try {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch('http://localhost:8088/pwcAutomationTest/searchWebServices?page=0&size=6',
            { method: 'POST', headers, body: JSON.stringify(req) });

        if (!res.ok) {
            throw new Error;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        return error;
    }
}

export default function WebServices() {
    const actionData = useActionData();
    console.log(actionData);
    const navigate = useNavigation();
    const status = navigate.state;

    return (
        <>
            <div className='titleContainer'>
                Web Services
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
                        Web Service Version:
                    </label>
                    <input type="text" name='wsVersion' placeholder='Enter Version' />
                </div>
                <button disabled={status === 'submitting'}>{status === 'submitting' ? 'Searching...' : 'Search'}</button>
            </Form>
        </>
    )
}
