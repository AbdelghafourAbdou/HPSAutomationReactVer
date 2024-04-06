import { } from 'react';
import { CiBank } from "react-icons/ci";

export default function Project() {
    return (
        <div className='projectContainer'>
            <div className='bankContainer'>
                <CiBank />
                COSMOTE
            </div>
            <div className='bankButtonsContainer'>
                <button>Reload Params</button>
                <button className='editButton'>Reload Web Service</button>
            </div>
        </div>
    )
}
