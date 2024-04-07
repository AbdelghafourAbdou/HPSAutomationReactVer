import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import './Error.css';

export default function NetworkError() {
    const error = useRouteError();
    const isResponse = isRouteErrorResponse(error);
    
    return (
        <>
            <div className='titleContainer'>
                Error
            </div>
            <div className='errorInfo'>
                <h1>{isResponse ? `${error.status} : ${error.statusText}` : error.name}</h1>
                <h3>{isResponse ? error.data.message : error.message}</h3>
            </div>
        </>
    )
}