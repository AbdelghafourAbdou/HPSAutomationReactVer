import { useRef, useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";
import Toast from "../../../Components/ReUsable Library/Toast/Toast";

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const type = formData.get('type');
    const sentIndicator = formData.get('sentIndicator');
    const intent = formData.get('intent');

    const headers = new Headers({ 'Content-Type': 'application/json' });
    if (intent === 'save') {
        const message = { 'id': null, name, email, type, sentIndicator };
        try {
            const res = await fetch('http://localhost:8088/pwcAutomationTest/newReportRecipient',
                { method: 'POST', headers, body: JSON.stringify(message) });

            if (!res.ok) {
                throw {
                    message: 'Error Saving Recipient',
                    errorStatus: res.status,
                    errorStatusText: res.statusText,
                }
            }

            const data = await res.json();
            return data;
        } catch (error) {
            return error;
        }
    } else if (intent === 'search') {
        const message = { 'id': null, name, email, type };
        try {
            const res = await fetch('http://localhost:8088/pwcAutomationTest/searchReportRecipient',
                { method: 'POST', headers, body: JSON.stringify(message) });

            if (!res.ok) {
                throw {
                    message: 'Error Searching for Recipients',
                    errorStatus: res.status,
                    errorStatusText: res.statusText,
                }
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.log('initialy caught error: ' + error.name);
            return error;
        }
    }
}

export default function EmailConfig() {
    const formRef = useRef(null);
    const fetcher = useFetcher();
    const formData = fetcher.data;
    const status = fetcher.state;

    const [successToast, setSuccessToast] = useState(false);
    const [failureToast, setFailureToast] = useState(false);
    const [recipients, setRecipients] = useState(null);
    const [tableReady, setTableReady] = useState(false);

    useEffect(() => {
        if (typeof formData != 'undefined') {
            if (status == 'idle' && Object.prototype.hasOwnProperty.call(formData, 'errorStatus')) {
                setFailureToast(true);
            }
            if (status == 'idle' && Object.prototype.hasOwnProperty.call(formData, 'id')) {
                setSuccessToast(true);
            }
        }
        formRef.current.reset();
    }, [formData, status]);

    useEffect(() => {
        if (typeof formData != 'undefined') {
            if (status == 'idle' && Array.isArray(formData)) {
                setRecipients(formData);
                setTableReady(true);
            }
        }
        formRef.current.reset();
    }, [formData, status]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const toast = document.getElementsByClassName('toast-container');
            if (toast.length == 0) {
                setFailureToast(false);
                setSuccessToast(false);
            }
        }, 100);
        return () => clearInterval(intervalId);
    }, []);

    function handleEdit() {

    }

    function handleDelete() {

    }

    return (
        <>
            <fetcher.Form ref={formRef} className='emailConfig' method="post" replace>
                <label>
                    Name:
                    <input type="text" placeholder="Enter your name" name="name" autoComplete="given-name" />
                </label>
                <label>
                    Email Address:
                    <input type="email" placeholder="Enter your email" name="email" autoComplete="email" />
                </label>
                <label>
                    Type:
                    <select name="type">
                        <option value="" key="0">-----</option>
                        <option value="CC" key="1">CC</option>
                        <option value="Normal" key="2">Normal</option>
                    </select>
                </label>
                <label>
                    Indicator:
                    <select name="sentIndicator">
                        <option value="" key="0">-----</option>
                        <option value="true" key="1">Yes</option>
                        <option value="false" key="2">No</option>
                    </select>
                </label>
                <div className="emailButtons">
                    <button disabled={status === 'submitting'} name="intent" value="save" >
                        {status === 'submitting' ? 'Saving' : 'Save Recipient'}
                    </button>
                    <button disabled={status === 'submitting'} name="intent" value="search">
                        {status === 'submitting' ? 'Searching' : 'Serach for Recipients'}
                    </button>
                </div>
            </fetcher.Form>
            {failureToast &&
                <Toast event='error'>
                    <p>Error</p>
                    <p>Could not Save Recipient</p>
                </Toast>
            }
            {successToast &&
                <Toast event='success'>
                    <p>Success</p>
                    <p>Recipient with Name: {formData.name} Saved</p>
                </Toast>
            }
            {tableReady &&
                <table className=''>
                    <thead>
                        <tr key="header">
                            <th>#</th>
                            <th>Name</th>
                            <th>Mail</th>
                            <th>Type</th>
                            <th>To Send</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipients.map(row =>
                            <tr key={`data row ${row.id}`}>
                                <td>{row.id}</td>
                                <td>{row.name}</td>
                                <td>{row.email}</td>
                                <td>{row.type}</td>
                                <td>{row.sentIndicator ? 'Yes' : 'No'}</td>
                                <td><button onClick={handleEdit}>Edit</button></td>
                                <td><button onClick={handleDelete}>Delete</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }
        </>
    )
}
