import { useRef, useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";
import Toast from "../../../Components/ReUsable Library/Toast/Toast";

const BASEPATH = 'http://localhost:8088/pwcAutomationTest';

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
            const res = await fetch(`${BASEPATH}/newReportRecipient`,
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
            const res = await fetch(`${BASEPATH}/searchReportRecipient`,
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
            return error;
        }
    } else if (intent === 'delete') {
        const id = formData.get('id');
        try {
            const res = await fetch(`${BASEPATH}/deleteReportRecipient/${id}`);

            if (!res.ok) {
                throw {
                    message: `Error Deleting Recipient with ID: ${id}`,
                    errorStatus: res.status,
                    errorStatusText: res.statusText,
                }
            }

            const data = await res.json();
            delete data.id;
            return data;
        } catch (error) {
            return error;
        }
    } else if (intent === 'update') {
        const id = formData.get('id');
        const message = { id, name, email, type, sentIndicator };
        try {
            const res = await fetch(`${BASEPATH}/updateReportRecipient`,
                { method: 'POST', headers, body: JSON.stringify(message) });

            if (!res.ok) {
                throw {
                    message: 'Error Updating Recipient',
                    errorStatus: res.status,
                    errorStatusText: res.statusText,
                }
            }

            let data = await res.json();
            data = { ...data, updated: true };
            return data;
        } catch (error) {
            return error;
        }
    }
}

export default function EmailConfig() {
    const formRef = useRef(null);
    const updateFormRef = useRef(null);
    const savedDataRef = useRef(null);
    const fetcher = useFetcher();
    const formData = fetcher.data;
    const status = fetcher.state;

    const [successToast, setSuccessToast] = useState(false);
    const [failureToast, setFailureToast] = useState(false);
    const [recipients, setRecipients] = useState(null);
    const [tableReady, setTableReady] = useState(false);
    const [editForm, setEditForm] = useState(false);

    // display toasts
    useEffect(() => {
        if (typeof formData != 'undefined') {
            if (status == 'idle' && Object.prototype.hasOwnProperty.call(formData, 'errorStatus')) {
                setFailureToast(true);
            } else if (status == 'idle' && Object.prototype.hasOwnProperty.call(formData, 'updated')) {
                savedDataRef.current = formData;
                setSuccessToast(true);
                return;
            } else if (status == 'idle' && Object.prototype.hasOwnProperty.call(formData, 'id')) {
                setSuccessToast(true);
            }
        }
        formRef.current.reset();
    }, [formData, status]);

    // display table
    useEffect(() => {
        if (typeof formData != 'undefined') {
            if (status == 'idle' && Array.isArray(formData)) {
                setRecipients(formData);
                setTableReady(true);
            }
        }
        formRef.current.reset();
    }, [formData, status]);

    // reset toasts
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

    function handleEdit(row) {
        document.getElementById('editName').setAttribute('value', row.name);
        document.getElementById('editEmail').setAttribute('value', row.email);
        document.getElementById('editType').value = row.type;
        document.getElementById('editIndicator').value = row.sentIndicator;
        document.getElementById('idButton').value = row.id;
        //document.getElementById('root').style.opacity = '0.5';
        setEditForm(true);
    }
    function cancelUpdate() {
        document.getElementById('root').style.opacity = '1';
        setEditForm(false);
    }
    function handleUpdateFormSubmission(e) {
        const updateFormData = new FormData(updateFormRef.current);
        updateFormData.append('intent', 'update');
        updateFormData.append('id', e.target.value);
        fetcher.submit(updateFormData, { method: 'POST' });
        const refreshFormData = new FormData();
        refreshFormData.append('name', "");
        refreshFormData.append('email', "");
        refreshFormData.append('type', "");
        refreshFormData.append('intent', 'search');
        setTimeout(() => fetcher.submit(refreshFormData, { method: 'POST' }), 500);
        setEditForm(false);
    }

    function handleDelete(id) {
        const deleteFormData = new FormData();
        deleteFormData.append('id', id);
        deleteFormData.append('intent', 'delete');
        fetcher.submit(deleteFormData, { method: 'POST' });
        const refreshFormData = new FormData();
        refreshFormData.append('name', "");
        refreshFormData.append('email', "");
        refreshFormData.append('type', "");
        refreshFormData.append('intent', 'search');
        setTimeout(() => fetcher.submit(refreshFormData, { method: 'POST' }), 500);
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
                        {status === 'submitting' ? 'Saving ...' : 'Save Recipient'}
                    </button>
                    <button disabled={status === 'submitting'} name="intent" value="search">
                        {status === 'submitting' ? 'Searching ...' : 'Search for Recipients'}
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
                    <p>Recipient with Name: {formData?.name || savedDataRef.current?.name} {formData?.name ? 'Saved' : 'Updated'}</p>
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
                                <td><button onClick={() => handleEdit(row)}>Edit</button></td>
                                <td><button onClick={() => handleDelete(row.id)}>Delete</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }
            <fetcher.Form ref={updateFormRef} style={{ visibility: editForm ? 'visible' : 'hidden' }}
                id="editForm" className='editForm' method="post" replace>
                <h2>Edit Report Recipient</h2>
                <label htmlFor="editName">
                    Name:
                </label>
                <input id="editName" type="text" placeholder="Enter your name" name="name" autoComplete="given-name" />
                <label htmlFor="editEmail">
                    Email Address:
                </label>
                <input id="editEmail" type="email" placeholder="Enter your email" name="email" autoComplete="email" />
                <label htmlFor="editType">
                    Type:
                </label>
                <select name="type" id="editType">
                    <option value="" key="0">-----</option>
                    <option value="CC" key="1">CC</option>
                    <option value="Normal" key="2">Normal</option>
                </select>
                <label htmlFor="editIndicator">
                    Indicator:
                </label>
                <select id="editIndicator" name="sentIndicator">
                    <option value="" key="0">-----</option>
                    <option value="true" key="1">Yes</option>
                    <option value="false" key="2">No</option>
                </select>
                <div className="emailButtons">
                    <button type="button" onClick={handleUpdateFormSubmission}
                        id="idButton" value="" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Updating ...' : 'Update'}
                    </button>
                    <button type="button" onClick={cancelUpdate} >
                        Cancel
                    </button>
                </div>
            </fetcher.Form>
        </>
    )
}
