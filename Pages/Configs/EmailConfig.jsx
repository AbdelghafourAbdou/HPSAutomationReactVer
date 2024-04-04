import { useRef, useEffect } from "react"
import { Form, useActionData, useNavigation } from "react-router-dom"

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const type = formData.get('type');
    const sentIndicator = formData.get('sentIndicator');
    const message = { 'id': null, name, email, type, sentIndicator };
    try {
        const res = await fetch('http://localhost:8080/pwcAutomationTest/newReportRecipient',
            { method: 'POST', body: JSON.stringify(message) });

        if (!res.ok) {
            throw {
                message: data.message,
                error: res.error,
                errorStatus: res.status,
            }
        }

        const data = await res.json();
        return data;
    } catch (error) {
        return error;
    }
}

export default function EmailConfig() {
    const formRef = useRef(null);

    const formData = useActionData();
    const navigation = useNavigation();
    const status = navigation.state;

    useEffect(() => {
        const form = formRef.current;
        status === 'idle' && !formData.error ?  form?.reset() : null;

    }, [formData, status])

    console.log(formData);

    return (
        <Form ref={formRef} className='emailConfig' method="post" replace>
            <label>
                Name:
                <input type="text" placeholder="Enter your name" name="name" />
            </label>
            <label>
                Email Address:
                <input type="email" placeholder="Enter your email" name="email" />
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
            <button disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending' : 'Save Recipient'}</button>
        </Form>
    )
}
