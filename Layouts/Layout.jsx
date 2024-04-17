import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Components/Header/Header';
import NavBar from '../Components/NavBar/NavBar';
import Footer from '../Components/Footer/Footer';
import './Layout.css'

export default function Layout() {
    let location = useLocation();
    useEffect(() => {
        document.documentElement.classList.remove('hideScrollBar');
    }, [location])

    return (
        <div className='viewport'>
            <NavBar />
            <div className='contentContainer'>
                <Header />
                <div className='displayContainer'>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    )
}
