/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
    getFormattedCurrentDateTime, generateSixRandomNumbers,
    getFormattedCurrentDate, getFormattedCurrentTime,
    generateElevenNumbers, getJulianFormattedDate,
    toProperMultipleWords, generatePINBlock,
} from '../../../Utils/Utils';
import './Creation.css';

const BASEPATH = 'http://localhost:8088/pwcAutomationTest/DataBase';

export default function BaseCreation({ setIsCreationOpen, setSelectorChoice, displayBase, fetcher, setSuccessToast }) {
    const [baseMessageDetails, setbBaseMessageDetails] = useState({
        baseMessage: '',
        msgType: '',
        cardNumber: '',
        processingCode: '',
        amount: 0,
        transmissionDateTime: '',
        auditNumber: '',
        transactionTime: '',
        transactionDate: '',
        expirationDate: '',
        merchantType: '',
        countryCode: '',
        entryCode: '',
        conditionCode: '',
        acquiringInstitutionCode: '',
        retrievalReferenceNumber: '',
        cardAcceptorTerminalID: '',
        cardAcceptorIdCode: '',
        cardAcceptorNameLocation: '',
        currencyCodeTrans: '',
        currencyCodeBilling: '',
        PINBlock: '',
        securityControlInfo: '',
        POS: '',
    });

    // prefill the form with auto generated data
    function preFillForm() {
        const field11 = generateSixRandomNumbers();
        const field32 = generateElevenNumbers();
        setbBaseMessageDetails(prev => ({
            ...prev,
            cardNumber: localStorage.getItem('latestCard'),
            transmissionDateTime: getFormattedCurrentDateTime(),
            auditNumber: field11,
            transactionTime: getFormattedCurrentTime(),
            transactionDate: getFormattedCurrentDate(),
            expirationDate: 2801,
            acquiringInstitutionCode: field32,
            retrievalReferenceNumber: `${getJulianFormattedDate()}${field11}`,
            cardAcceptorTerminalID: 'TERMID01',
            cardAcceptorIdCode: 'CARD ACCEPTOR  ',
            cardAcceptorNameLocation: 'CARD ACCEPTOR TESTDATA   CASABLANCA   MA',
            PINBlock: generatePINBlock('0591', localStorage.getItem('latestCard')),
            securityControlInfo: '2001010100000000',
        }));
    }

    // handle the creation of the base message
    async function handleBaseMessageCreation(e) {
        e.preventDefault();
        const message = {
            '002': baseMessageDetails.cardNumber,
            '003': baseMessageDetails.processingCode,
            '004': String(baseMessageDetails.amount).padStart(12, '0'),
            '006': String(baseMessageDetails.amount).padStart(12, '0'),
            '007': baseMessageDetails.transmissionDateTime,
            '011': baseMessageDetails.auditNumber,
            '012': baseMessageDetails.transactionTime,
            '013': baseMessageDetails.transactionDate,
            '014': baseMessageDetails.expirationDate,
            '018': baseMessageDetails.merchantType,
            '019': baseMessageDetails.countryCode,
            '022': baseMessageDetails.entryCode,
            '023': '', // to be filled with a query from db
            '025': baseMessageDetails.conditionCode,
            '032': baseMessageDetails.acquiringInstitutionCode,
            '035': '',  // to be filled with a query from db
            '037': baseMessageDetails.retrievalReferenceNumber,
            '041': baseMessageDetails.cardAcceptorTerminalID,
            '042': baseMessageDetails.cardAcceptorIdCode,
            '043': baseMessageDetails.cardAcceptorNameLocation,
            '049': baseMessageDetails.currencyCodeTrans,
            '051': baseMessageDetails.currencyCodeBilling,
            '052': baseMessageDetails.PINBlock,
            '053': baseMessageDetails.securityControlInfo,
            '060': baseMessageDetails.POS,
        }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch(`${BASEPATH}/addBaseTest?baseMessageString=${toProperMultipleWords(baseMessageDetails.baseMessage)}&msgTypeString=${String(baseMessageDetails.msgType).padStart(4, '0')}&msgHeaderString=16010200FE0000000000000000000000000000000000`,
            { method: 'POST', headers, body: JSON.stringify(message, Object.keys(message).sort()) });
        const createdMessage = await res.text();
        const regex = new RegExp('\\d{3}_\\w+', 'g');
        regex.test(createdMessage) ? localStorage.setItem('baseTest', createdMessage) : null;

        setIsCreationOpen(prev => ({ ...prev, baseMessage: false }));
        document.documentElement.classList.remove('hideScrollBar');
        fetcher.load('/cardMGT');
        setSelectorChoice(prev => ({ ...prev, baseMessage: createdMessage}));
        displayBase(createdMessage);
        setSuccessToast([true, "Base Message Created"]);
    }

    // handle the closing of the creation form
    function handleCloseCreation() {
        setIsCreationOpen(prev => ({ ...prev, baseMessage: false }))
        document.documentElement.classList.remove('hideScrollBar');
    }

    // handle the input fields change
    function handleFormDataChange(e) {
        let { name, value } = e.target;
        if (name === 'amount') {
            value = Number(value);
            if (!Number.isInteger(value)) {
                value = Math.round(value * 100) / 100
            }
            value *= 100;
        }
        setbBaseMessageDetails(prev => ({
            ...prev, [name]: value
        }));
    }

    return (
        <>
            <div className='overlay'></div>
            <div className='baseCreationContainer'>
                <div className='testCaseTitle'>
                    <h1>Base Message Creation</h1>
                    <div>
                        <button onClick={preFillForm} className='mg-right'>
                            Pre-Fill
                        </button>
                        <button onClick={handleCloseCreation}>
                            Back &rarr;
                        </button>
                    </div>
                </div>
                <form method='post' className='baseMessageCreationForm'>
                    <div>
                        <label htmlFor="baseMessage">Base Message Name:</label>
                        <input id='baseMessage' type="text" name='baseMessage' value={baseMessageDetails.baseMessage}
                            onChange={handleFormDataChange} placeholder='Enter Base Test Name' />
                    </div>
                    <div>
                        <label htmlFor="msgType">Message Type:</label>
                        <input type='text' id='msgType' name='msgType' value={baseMessageDetails.msgType}
                            onChange={handleFormDataChange} placeholder='Enter Base Message Type'>
                        </input>
                    </div>
                    <div>
                        <label htmlFor="cardNumber">Card Number:</label>
                        <input id='cardNumber' type="text" name='cardNumber' value={baseMessageDetails.cardNumber}
                            onChange={handleFormDataChange} placeholder='Enter the Card Number' />
                    </div>
                    <div>
                        <label htmlFor="processingCode">Processing Code:</label>
                        <input id='processingCode' type="text" name='processingCode' value={baseMessageDetails.processingCode}
                            onChange={handleFormDataChange} placeholder='Enter the Processing Code' />
                    </div>
                    <div>
                        <label htmlFor="amount">Amount:</label>
                        <input id='amount' type="number" name='amount' step="0.01"
                            onChange={handleFormDataChange} placeholder='Enter the Amount' />
                    </div>
                    <div>
                        <label htmlFor="transmissionDateTime">Transmission Date and Time:</label>
                        <input id='transmissionDateTime' type="text" name='transmissionDateTime' value={baseMessageDetails.transmissionDateTime}
                            onChange={handleFormDataChange} placeholder='Enter the Transmission Date and Time' />
                    </div>
                    <div>
                        <label htmlFor="auditNumber">System Trace Audit Number:</label>
                        <input id='auditNumber' type="text" name='auditNumber' value={baseMessageDetails.auditNumber}
                            onChange={handleFormDataChange} placeholder='Enter the System Trace Audit Number' />
                    </div>
                    <div>
                        <label htmlFor="transactionTime">Local Transaction Time:</label>
                        <input id='transactionTime' type="text" name='transactionTime' value={baseMessageDetails.transactionTime}
                            onChange={handleFormDataChange} placeholder='Enter the Local Transaction Time' />
                    </div>
                    <div>
                        <label htmlFor="transactionDate">Local Transaction Date:</label>
                        <input id='transactionDate' type="text" name='transactionDate' value={baseMessageDetails.transactionDate}
                            onChange={handleFormDataChange} placeholder='Enter the Local Transaction Date' />
                    </div>
                    <div>
                        <label htmlFor="expirationDate">Expiration Date:</label>
                        <input id='expirationDate' type="text" name='expirationDate' value={baseMessageDetails.expirationDate}
                            onChange={handleFormDataChange} placeholder='Enter the Expiration Date' />
                    </div>
                    <div>
                        <label htmlFor="merchantType">Merchant Type:</label>
                        <input id='merchantType' type="text" name='merchantType' value={baseMessageDetails.merchantType}
                            onChange={handleFormDataChange} placeholder='Enter the Merchant Type' />
                    </div>
                    <div>
                        <label htmlFor="countryCode">Acquiring Institution Country Code:</label>
                        <input id='countryCode' type="text" name='countryCode' value={baseMessageDetails.countryCode}
                            onChange={handleFormDataChange} placeholder='Enter the Country Code' />
                    </div>
                    <div>
                        <label htmlFor="entryCode">Point-of-Service Entry Mode Code:</label>
                        <input id='entryCode' type="text" name='entryCode' value={baseMessageDetails.entryCode}
                            onChange={handleFormDataChange} placeholder='Enter the Entry Mode Code' />
                    </div>
                    <div>
                        <label htmlFor="conditionCode">Point-of-Service Condition Code:</label>
                        <input id='conditionCode' type="text" name='conditionCode' value={baseMessageDetails.conditionCode}
                            onChange={handleFormDataChange} placeholder='Enter the Condition Code' />
                    </div>
                    <div>
                        <label htmlFor="acquiringInstitutionCode">Acquiring Institution Identification Code:</label>
                        <input id='acquiringInstitutionCode' type="text" name='acquiringInstitutionCode' value={baseMessageDetails.acquiringInstitutionCode}
                            onChange={handleFormDataChange} placeholder='Enter the Identification Code' />
                    </div>
                    <div>
                        <label htmlFor="retrievalReferenceNumber">Retrieval Reference Number:</label>
                        <input id='retrievalReferenceNumber' type="text" name='retrievalReferenceNumber' value={baseMessageDetails.retrievalReferenceNumber}
                            onChange={handleFormDataChange} placeholder='Enter the Retrieval Reference Number' />
                    </div>
                    <div>
                        <label htmlFor="cardAcceptorTerminalID">Card Acceptor Terminal Identification:</label>
                        <input id='cardAcceptorTerminalID' type="text" name='cardAcceptorTerminalID' value={baseMessageDetails.cardAcceptorTerminalID}
                            onChange={handleFormDataChange} placeholder='Enter the Terminal Identification' />
                    </div>
                    <div>
                        <label htmlFor="cardAcceptorIdCode">Card Acceptor Identification Code:</label>
                        <input id='cardAcceptorIdCode' type="text" name='cardAcceptorIdCode' value={baseMessageDetails.cardAcceptorIdCode}
                            onChange={handleFormDataChange} placeholder='Enter the Identification Code' />
                    </div>
                    <div>
                        <label htmlFor="cardAcceptorNameLocation">Card Acceptor Name/Location:</label>
                        <input id='cardAcceptorNameLocation' type="text" name='cardAcceptorNameLocation' value={baseMessageDetails.cardAcceptorNameLocation}
                            onChange={handleFormDataChange} placeholder='Enter the Name/Location' />
                    </div>
                    <div>
                        <label htmlFor="currencyCodeTrans">Transaction Currency Code:</label>
                        <input id='currencyCodeTrans' type="text" name='currencyCodeTrans' value={baseMessageDetails.currencyCodeTrans}
                            onChange={handleFormDataChange} placeholder='Enter the Transaction Currency Code' />
                    </div>
                    <div>
                        <label htmlFor="currencyCodeBilling">Cardholder Billing Currency Code:</label>
                        <input id='currencyCodeBilling' type="text" name='currencyCodeBilling' value={baseMessageDetails.currencyCodeBilling}
                            onChange={handleFormDataChange} placeholder='Enter the Cardholder Billing Currency Code' />
                    </div>
                    <div>
                        <label htmlFor="PINBlock">Card PIN Block:</label>
                        <input id='PINBlock' type="text" name='PINBlock' value={baseMessageDetails.PINBlock}
                            onChange={handleFormDataChange} placeholder='Enter the Card PIN Block' />
                    </div>
                    <div>
                        <label htmlFor="securityControlInfo">Security-Related Control Information:</label>
                        <input id='securityControlInfo' type="text" name='securityControlInfo' value={baseMessageDetails.securityControlInfo}
                            onChange={handleFormDataChange} placeholder='Enter the Security-Related Control Information' />
                    </div>
                    <div>
                        <label htmlFor="POS">Additional POS Information:</label>
                        <input id='POS' type="text" name='POS' value={baseMessageDetails.POS} 
                            onChange={handleFormDataChange} placeholder='Enter the POS Information' />
                    </div>
                    <button className='lastButton' onClick={handleBaseMessageCreation}>Save Base Message</button>
                </form>
            </div>
        </>
    )
}
