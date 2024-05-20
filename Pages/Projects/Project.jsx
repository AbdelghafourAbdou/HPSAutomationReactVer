import { useState, useEffect } from 'react';
import { CiBank } from "react-icons/ci";
import Toast from '../../Components/ReUsable Library/Toast/Toast';

// eslint-disable-next-line react/prop-types
export default function Project({ title, id }) {
    const [successToast, setSuccessToast] = useState(false);
    const [failToast, setFailToast] = useState(false);
    const [failureMessage, setFailureMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleReloadParams() {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8088/pwcAutomationTest/reloadParameters/${id}`);

            if (!res.ok) {
                throw new Error("Error Reloading Parameters");
            }

            const data = await res.json();
            setSuccessToast(true);
            return data;
        } catch (error) {
            setFailureMessage(error.message);
            setFailToast(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const toast = document.getElementsByClassName('toast-container');
            if (toast.length == 0) {
                setFailToast(false);
                setSuccessToast(false);
            } 
        }, 500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className='projectContainer'>
                <div className='bankContainer'>
                    <CiBank size='2em' />
                    {title}
                </div>
                <div className='bankButtonsContainer'>
                    <button disabled={loading} onClick={handleReloadParams}>{loading ? 'Loading Params ...' : 'Reload Params'}</button>
                </div>
            </div>
            {successToast &&
                <Toast event='success' delay=''>
                    <h4>Success</h4>
                    <p>Reload Success</p>
                </Toast>}
            {failToast &&
                <Toast event='error' delay=''>
                    <h4>Failure</h4>
                    <p>Reload Failure: {failureMessage}</p>
                </Toast>}
        </>
    )
}
