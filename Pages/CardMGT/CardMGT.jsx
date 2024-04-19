import { useState } from 'react';
import './CardMGT.css';

export default function CardMGT() {
    const [latestCard, ] = useState(localStorage.getItem('latestCard'));

    return (
        <>
            <div className='titleContainer'>
                Card Management
                <p>{latestCard ? latestCard : 'No Card Created Recently'}</p>
            </div>
        </>
    )
}
