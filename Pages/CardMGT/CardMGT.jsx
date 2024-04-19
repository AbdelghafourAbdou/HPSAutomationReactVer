import { useState, useEffect } from 'react';
import './CardMGT.css';

const BASEPATH = 'http://localhost:8088/pwcAutomationTest/DataBase';

export default function CardMGT() {
    const [latestCard,] = useState(localStorage.getItem('latestCard'));
    const [results, setResults] = useState(Array(4).fill(null));

    // activate the card
    async function handleActivateCard() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const res = await fetch(`${BASEPATH}/activateCard?cardNumber=${latestCard}`,
            { method: 'POST', headers });
        const data = await res.json();
        setResults(prev => [data, ...(prev.slice(1))]);
    }

    // create a card profile to the XML
    async function handleCardProfile() {
        const headers = new Headers({ 'Content-Type': 'text/html' });
        const res = await fetch(`${BASEPATH}/addCardProfile?cardNumber=${latestCard}`,
            { headers });
        const data = await res.text();
        setResults(prev => [prev[0], data, ...(prev.slice(2))]);
    }

    useEffect(() => {
        console.log(results);
    }, [results]);

    return (
        <>
            <div className='titleContainer'>
                Card Management
            </div>
            <div className='controlPanel'>
                <h2 className='latestCard'>Card: {latestCard ? latestCard : 'No Card Created Recently'}</h2>
                <p className='controlPanelDescription'>Please use the following buttons to run your tests: </p>
                <div className='controlPanelButtons'>
                    <div className='controlPanelButton'>
                        <button onClick={handleActivateCard}>Activate Card</button>
                        <p>{results[0] === null ? 'No Updates' : results[0] ? 'Card Activated Successfully' : 'Card Activation Failed'}</p>
                    </div>
                    <div className='controlPanelButton'>
                        <button onClick={handleCardProfile}>Add Card Profile</button>
                        <p>{results[1] === null ? 'No Updates' : results[1].indexOf('<CardProfile') !== -1 ? 'Card Profile Added Successfuly' : results[1]}</p>
                    </div>
                    <div className='controlPanelButton'>
                        <button>Add Base Test</button>
                        <p>No Updates</p>
                    </div>
                    <div className='controlPanelButton'>
                        <button>Create MSG File</button>
                        <p>No Updates</p>
                    </div>
                </div>
            </div>
        </>
    )
}
