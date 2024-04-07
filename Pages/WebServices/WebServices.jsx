import { useRef, useState, useEffect } from 'react';
import { useSearchParams, useFetcher, json } from 'react-router-dom';
import Toast from '../../Components/ReUsable Library/Toast/Toast';
import reload from '/reload.svg';
import './WebServices.css';

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
    const formData = await request.formData();
    const project = formData.get('project');
    const webService = formData.get('webService');
    const wsVersion = formData.get('wsVersion');

    const requestURL = new URL(request.url).toString();
    const questionMark = requestURL.indexOf('page');
    const extractedInfo = requestURL.slice(questionMark + 5);
    let pageNumber = isNaN(extractedInfo) ? 0 : extractedInfo;

    const req = { project, webService, wsVersion };

    const headers = new Headers({ 'Content-Type': 'application/json' });
    try {
        const res = await fetch(`http://localhost:8088/pwcAutomationTest/searchWebServices?page=${pageNumber}&size=6`,
            { method: request.method, headers, body: JSON.stringify(req) });

        if (!res.ok) {
            throw json({ message: res.statusText }, { status: res.status });
        }

        const data = await res.json();
        return data;
    } catch (error) {
        throw json({ message: 'Failed to Fetch, Server is Down.'}, { status: 503, statusText: 'Service Unavailable' });
    }
}

export default function WebServices() {
    const [successID, setSuccessID] = useState(0);
    const [failureID, setFailureID] = useState(0);
    const formRef = useRef();
    const fetcher = useFetcher();
    const [, setSearchParams] = useSearchParams();
    const actionData = fetcher.data;
    const data = actionData?.content || [];
    const pageNumber = Number(actionData?.pageable?.pageNumber) || 0;
    const totalPages = actionData?.totalPages || null;
    const status = fetcher.state;

    useEffect(() => {
        const intervalId = setInterval(() => {
            const toast = document.getElementsByClassName('toast-container');
            if (toast.length == 0) {
                setFailureID(0);
                setSuccessID(0);
            }
        }, 500);
        return () => clearInterval(intervalId);
    }, []);

    async function handleReload(id) {
        try {
            await fetch(`http://localhost:8088/pwcAutomationTest/reloadWebService/${id}`);
            setSuccessID(id);
        } catch (error) {
            setFailureID(id);
        }
    }

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
    }

    return (
        <>
            <div className='titleContainer'>
                Web Services
            </div>
            <fetcher.Form ref={formRef} method='POST' className='webServicesFormContainer' action='/webServices' replace>
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
                    <label htmlFor='webService'>
                        Web Service:
                    </label>
                    <input id='webService' type="text" name='webService' placeholder='Enter Web Service' />
                </div>
                <div className='fieldContainer'>
                    <label htmlFor='wsVersion'>
                        Web Service Version:
                    </label>
                    <input id='wsVersion' type="text" name='wsVersion' placeholder='Enter Version' />
                </div>
                <button disabled={status === 'submitting'}>{status === 'submitting' ? 'Searching...' : 'Search'}</button>
            </fetcher.Form>
            {actionData &&
                <>
                    <table className=''>
                        <thead>
                            <tr key="header">
                                <th>#</th>
                                <th>Name</th>
                                <th>Project Name</th>
                                <th>WS Version</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row =>
                                <tr key={`data row ${row.id}`}>
                                    <td>{row.id}</td>
                                    <td>{row.name}</td>
                                    <td>{row.project.name}</td>
                                    <td>{row.version}</td>
                                    <td>
                                        <button onClick={() => handleReload(row.id)} >
                                            <img src={reload} alt="reload icon" className='reloadIcon' />
                                        </button>
                                    </td>
                                    {successID === row.id &&
                                        <Toast event='success' delay=''>
                                            <h4>Success</h4>
                                            <p>Reload Success for Web Service {row.id}</p>
                                        </Toast>
                                    }
                                    {failureID === row.id &&
                                        <Toast event='error' delay=''>
                                            <h4>Failure</h4>
                                            <p>Reload Failure for Web Service {row.id}</p>
                                        </Toast>
                                    }
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='pagingControl'>
                        {totalPages && <button onClick={() => handleArrowClick(-1)}>&larr;</button>}
                        {pageNumber + 1}{totalPages ? ` / ${totalPages}` : ''}
                        {totalPages && <button onClick={() => handleArrowClick(1)}>&rarr;</button>}
                    </div>
                </>
            }
        </>
    )
}
