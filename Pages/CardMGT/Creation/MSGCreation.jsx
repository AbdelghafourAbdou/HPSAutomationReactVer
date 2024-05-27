/* eslint-disable react/prop-types */
import { useState } from 'react';
import { generateConsequentNumber } from '../../../Utils/Utils';
import { createPortal } from 'react-dom';
import info from '/infoCircle.svg';
import xCircle from '/xCircle.svg';
import editPencil from '/editPencil.svg';
import RowEdit from './RowEdit';

const BASEPATH = 'http://localhost:8088/pwcAutomationTest/DataBase';

export default function MSGCreation({ setIsCreationOpen, setSelectorChoice, displayMSG,
    fetcher, oldData, setSuccessToast }) {
    let parser = new DOMParser();
    let xmlDoc;
    let message = [];
    let tableRows = [];
    if (oldData) {
        xmlDoc = parser.parseFromString(oldData, "text/xml");
        message = xmlDoc.getElementsByTagName("SimMessage");
        let fields = xmlDoc.getElementsByTagName("Field");
        let fieldsArray = [...fields];
        tableRows = fieldsArray.map(field => ({
            number: field.getAttribute("Number"),
            subField: field.getAttribute("Subfield"),
            specValType: field.getAttribute("SpecValType"),
            specValSubType: field.getAttribute("SpecValSubType"),
            value: field.getAttribute("Value")
        }));
    }
    const [MSGDetails, setMSGDetails] = useState({
        name: message[0]?.getAttribute("Name") || '',
        baseTestName: message[0]?.getAttribute("BaseTestName") || '',
        caseId: message[0]?.getAttribute("CaseId") || '',
        sequence: message[0]?.getAttribute("Sequence") || '',
        cardProfile: message[0]?.getAttribute("CardProfile") || '',
        terminalProfile: message[0]?.getAttribute("TerminalProfile") || '',
        isPlayable: message[0]?.getAttribute("IsPlayable") || '',
        description: message[0]?.getAttribute("Description") || '',
        headLine: message[0]?.getAttribute("HeadLine") || '',
        rootCaseSpecValues: {
            fields: tableRows,
        },
    });
    const [addRowDetails, setAddRowDetails] = useState([false, {
        number: "",
        subField: "",
        specValType: "",
        specValSubType: "",
        value: ""
    }]);
    const [editWindowOpen, setEditWindowOpen] = useState([false, null, null]);

    // prefill the form with auto generated data
    function preFillForm() {
        let cardProfile = localStorage.getItem('cardProfile');
        let baseTest = localStorage.getItem('baseTest');
        let consequentNumber = generateConsequentNumber();
        let regex = new RegExp('(?<=_)([a-zA-Z]+)(?=_)');
        setMSGDetails(prev => ({
            ...prev,
            name: `MSG_${consequentNumber}_${baseTest}`,
            baseTestName: baseTest,
            caseId: consequentNumber,
            sequence: Number(consequentNumber.slice(-3)),
            cardProfile: cardProfile.slice(19, 39),
            terminalProfile: 'MER_SHOP_ONUS_B1',
            isPlayable: 1,
            description: regex.exec(baseTest)[0],
        }));
    }

    // handle the closing of the creation form
    function handleCloseCreation() {
        oldData ? setIsCreationOpen(prev => ({ ...prev, MSGEdit: false }))
            : setIsCreationOpen(prev => ({ ...prev, MSG: false }));
        document.documentElement.classList.remove('hideScrollBar');
    }

    // handle the creation of the MSG file
    async function handleMSGFileCreation(e, newFile, altSequence = false) {
        e.preventDefault();
        let name, caseId, sequence;
        if (altSequence) {
            let consequentNumber = generateConsequentNumber();
            name = `MSG_${consequentNumber}_${MSGDetails.baseTestName}`;
            caseId = consequentNumber;
            sequence = Number(consequentNumber.slice(-3));
        } else {
            name = MSGDetails.name;
            caseId = MSGDetails.caseId;
            sequence = MSGDetails.sequence;
        }
        const message = {
            name: name,
            baseTestName: MSGDetails.baseTestName,
            caseId: caseId,
            sequence: sequence,
            cardProfile: MSGDetails.cardProfile,
            terminalProfile: MSGDetails.terminalProfile,
            isPlayable: MSGDetails.isPlayable,
            description: MSGDetails.description,
            headLine: MSGDetails.headLine,
            rootCaseSpecValues: MSGDetails.rootCaseSpecValues,
        }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch(`${BASEPATH}/addMSG`,
            { method: 'POST', headers, body: JSON.stringify(message) });
        const createdMessage = await res.text();

        oldData ? setIsCreationOpen(prev => ({ ...prev, MSGEdit: false }))
            : setIsCreationOpen(prev => ({ ...prev, MSG: false }));
        document.documentElement.classList.remove('hideScrollBar');
        fetcher.load('/PSTTMGT');
        setSelectorChoice(prev => ({ ...prev, MSG: createdMessage }));
        displayMSG(createdMessage);
        let successMessage = altSequence||newFile ? "Created" : "Updated";
        setSuccessToast([true, `MSG File ${successMessage}`]);
    }

    // handle the add/save row button
    function handelAddRow() {
        if (!addRowDetails[0]) {
            setAddRowDetails(prev => ([true, prev[1]]));
        } else {
            const field = addRowDetails[1];
            setMSGDetails(prev => ({ ...prev, rootCaseSpecValues: { fields: [...(prev.rootCaseSpecValues.fields), field] } }));
            setAddRowDetails([false, {
                number: "",
                subField: "",
                specValType: "",
                specValSubType: "",
                value: ""
            }]);
        }
    }
    // handle the delete row button
    function handleDeleteRow(rowIndex) {
        setMSGDetails(prev => ({
            ...prev,
            rootCaseSpecValues: {
                fields: prev.rootCaseSpecValues.fields.toSpliced(rowIndex, 1),
            }
        }))
    }
    // handle the edit row button 
    function handleEditRow(field, rowIndex) {
        setEditWindowOpen([true, field, rowIndex]);
    }

    // handle change of add row inputs
    function handleRowInsertionChange(e) {
        let { name, value } = e.target;
        setAddRowDetails(prev => ([prev[0], {
            ...prev[1], [name]: value
        }]));
    }
    // handle the input fields change
    function handleFormDataChange(e) {
        let { name, value } = e.target;
        setMSGDetails(prev => ({
            ...prev, [name]: value
        }));
    }

    return (
        <>
            <div className='overlay'></div>
            <div className='baseCreationContainer'>
                <div className='testCaseTitle'>
                    <h1>MSG File Creation</h1>
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
                        <label htmlFor="MSGName">MSG Name:</label>
                        <input id='MSGName' type="text" name='MSGName' value={MSGDetails.name}
                            onChange={handleFormDataChange} placeholder='Enter MSG Name' />
                    </div>
                    <div>
                        <label htmlFor="headLine">Headline:</label>
                        <input id='headLine' type="text" name='headLine' value={MSGDetails.headLine}
                            onChange={handleFormDataChange} placeholder='Enter Headline' />
                    </div>
                    <div>
                        <label htmlFor="baseTestName">Base Test Name:</label>
                        <input id='baseTestName' type="text" name='baseTestName' value={MSGDetails.baseTestName}
                            onChange={handleFormDataChange} placeholder='Enter Base Test Name' />
                    </div>
                    <div>
                        <label htmlFor="caseId">Case ID:</label>
                        <input id='caseId' type="text" name='caseId' value={MSGDetails.caseId}
                            onChange={handleFormDataChange} placeholder='Enter Case ID' />
                    </div>
                    <div>
                        <label htmlFor="sequence">Sequence Number:</label>
                        <input id='sequence' type="text" name='sequence' value={MSGDetails.sequence}
                            onChange={handleFormDataChange} placeholder='Enter Sequence Number' />
                    </div>
                    <div>
                        <label htmlFor="cardProfile">Card Profile:</label>
                        <input id='cardProfile' type="text" name='cardProfile' value={MSGDetails.cardProfile}
                            onChange={handleFormDataChange} placeholder='Enter Card Profile' />
                    </div>
                    <div>
                        <label htmlFor="terminalProfile">Terminal Profile:</label>
                        <input id='terminalProfile' type="text" name='terminalProfile' value={MSGDetails.terminalProfile}
                            onChange={handleFormDataChange} placeholder='Enter Terminal Profile' />
                    </div>
                    <div>
                        <label htmlFor="isPlayable">Playability:</label>
                        <input id='isPlayable' type="text" name='isPlayable' value={MSGDetails.isPlayable}
                            onChange={handleFormDataChange} placeholder='Enter IsPlayable' />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <input id='description' type="text" name='description' value={MSGDetails.description}
                            onChange={handleFormDataChange} placeholder='Enter Description' />
                    </div>
                    <div>
                        <table>
                            <thead id='fieldsTHead'>
                                <tr>
                                    <th>Number</th>
                                    <th>Subfield</th>
                                    <th>SpecValType</th>
                                    <th>SpecValSubType</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id='addRowBody'>
                                {MSGDetails.rootCaseSpecValues.fields.length > 0 &&
                                    MSGDetails.rootCaseSpecValues.fields.map((field, index) =>
                                        <tr key={field.number}>
                                            <td>{field.number}</td>
                                            <td>{field.subField}</td>
                                            <td>{field.specValType}</td>
                                            <td>{field.specValSubType}</td>
                                            <td>{field.value}</td>
                                            <td id='MSGTableActions'>
                                                <button type='button' onClick={() => handleDeleteRow(index)}>
                                                    <img src={xCircle} alt="Delete Icon" className='lightColor' />
                                                </button>
                                                <button type='button' onClick={() => handleEditRow(field, index)} id='lastMSGTableActionButton'>
                                                    <img src={editPencil} alt="Edit Icon" className='lightColor' />
                                                </button>
                                            </td>
                                        </tr>)
                                }
                                {editWindowOpen[0] && createPortal(
                                    <RowEdit field={editWindowOpen[1]} index={editWindowOpen[2]} 
                                    changeFields={setMSGDetails} setEditWindowOpen={setEditWindowOpen}/>, document.body
                                )}
                            </tbody>
                        </table>
                        {MSGDetails.rootCaseSpecValues.fields.length == 0 &&
                            <div className='centeringDiv'>
                                <div className='testSuitesInfo'>
                                    <img src={info} alt="Information Circle" className='lightColor' />
                                    <h1>No Rows Added Yet. Please Use the Button Below.</h1>
                                </div>
                            </div>}
                        {addRowDetails[0] &&
                            <div className='addRowContainer'>
                                <div>
                                    <label htmlFor="number">Field Number: </label>
                                    <input id='number' type='number' name='number' value={addRowDetails[1].number}
                                        onChange={handleRowInsertionChange} placeholder='Enter Field Number' />
                                </div>
                                <div>
                                    <label htmlFor="subField">Field Sub Field: </label>
                                    <input id='subField' type="text" name='subField' value={addRowDetails[1].subField}
                                        onChange={handleRowInsertionChange} placeholder='Enter Field Sub Field' />
                                </div>
                                <div>
                                    <label htmlFor="specValType">Field specValType: </label>
                                    <input id='specValType' type="number" name='specValType' value={addRowDetails[1].specValType}
                                        onChange={handleRowInsertionChange} placeholder='Enter Field specValType' />
                                </div>
                                <div>
                                    <label htmlFor="specValSubType">Field specValSubType: </label>
                                    <input id='specValSubType' type="number" name='specValSubType' value={addRowDetails[1].specValSubType}
                                        onChange={handleRowInsertionChange} placeholder='Enter Field specValSubType' />
                                </div>
                                <div>
                                    <label htmlFor="value">Field Value: </label>
                                    <input id='value' type="text" name='value' value={addRowDetails[1].value}
                                        onChange={handleRowInsertionChange} placeholder='Enter Field Value' />
                                </div>
                            </div>
                        }
                        <button type='button' onClick={handelAddRow} id='MSGTableButton'>{addRowDetails[0] ? 'Save Row' : 'Add Row'}</button>
                    </div>
                    {
                        oldData ?
                            <div id='lastSetOfButtons' className='lastButton'>
                                <button onClick={(e) => handleMSGFileCreation(e, false)}>Overwrite Existing MSG</button>
                                <button onClick={(e) => handleMSGFileCreation(e, false, true)}>Create New MSG</button>
                            </div>
                            : <button className='lastButton' onClick={(e) => handleMSGFileCreation(e, true)}>Save MSG File</button>
                    }
                </form>
            </div>
        </>
    )
}
