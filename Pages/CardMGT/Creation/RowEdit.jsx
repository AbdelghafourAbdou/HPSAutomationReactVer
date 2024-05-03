/* eslint-disable react/prop-types */
import { useState } from 'react';
import './Creation.css';

export default function RowEdit({ field, index, changeFields, setEditWindowOpen }) {
    const [rowDetails, setRowDetails] = useState({
        number: field.number,
        subField: field.subField,
        specValType: field.specValType,
        specValSubType: field.specValSubType,
        value: field.value
    });

    // handle saving edited row data
    function handleSave() {
        changeFields(prev => ({
            ...prev,
            rootCaseSpecValues: {
                fields: prev.rootCaseSpecValues.fields.toSpliced(index, 1, rowDetails)
            }
        }));
        setEditWindowOpen([false, null, null]);
    }

    // handle closing the edit window
    function handleCloseEdit() {
        setEditWindowOpen([false, null, null]);
    }

    // handle editing row data
    function handleRowDataChange(e) {
        let { name, value } = e.target;
        setRowDetails(prev => ({
            ...prev, [name]: value
        }));
    }

    return (
        <>
            <div className='advancedOverlay'></div>
            <div className='editFieldForm'>
                <div className='testCaseTitle'>
                    <h1>Field Details Edit</h1>
                    <div>
                        <button onClick={handleCloseEdit}>
                            Back &rarr;
                        </button>
                    </div>
                </div>
                <div className='editRowField'>
                    <label htmlFor="number">Field Number: </label>
                    <input id='number' type='number' name='number' value={rowDetails.number}
                        onChange={handleRowDataChange} placeholder='Enter Field Number' />
                </div>
                <div className='editRowField'>
                    <label htmlFor="subField">Field Sub Field: </label>
                    <input id='subField' type="text" name='subField' value={rowDetails.subField}
                        onChange={handleRowDataChange} placeholder='Enter Field Sub Field' />
                </div>
                <div className='editRowField'>
                    <label htmlFor="specValType">Field specValType: </label>
                    <input id='specValType' type="number" name='specValType' value={rowDetails.specValType}
                        onChange={handleRowDataChange} placeholder='Enter Field specValType' />
                </div>
                <div className='editRowField'>
                    <label htmlFor="specValSubType">Field specValSubType: </label>
                    <input id='specValSubType' type="number" name='specValSubType' value={rowDetails.specValSubType}
                        onChange={handleRowDataChange} placeholder='Enter Field specValSubType' />
                </div>
                <div className='editRowField'>
                    <label htmlFor="value">Field Value: </label>
                    <input id='value' type="text" name='value' value={rowDetails.value}
                        onChange={handleRowDataChange} placeholder='Enter Field Value' />
                </div>
                <button className='lastButton' onClick={handleSave}>Save Changes</button>
            </div>
        </>
    )
}
