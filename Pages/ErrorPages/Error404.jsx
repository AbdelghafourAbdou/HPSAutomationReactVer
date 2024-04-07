import { Link } from 'react-router-dom';
import notFound from '/404.svg';
import './Error.css'

export default function Error404() {
    return (
        <>
            <div className='titleContainer'>
                Page Not Found
            </div>
            <div className='pathToHome'>
                <img className='notFound' src={notFound} alt="404 Image" />
                <Link to='..' className='errorHomeLink' >
                    <button>
                        Go to Home Page
                    </button>
                </Link>
            </div>
        </>
    )
}