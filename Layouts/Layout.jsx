import { } from 'react';
import { Outlet } from 'react-router-dom'
import Header from '../Components/Header/Header';
import NavBar from '../Components/NavBar/NavBar';
import Footer from '../Components/Footer/Footer';
import './Layout.css'

export default function Layout() {
    return (
        <div className='viewport'>
            <NavBar />
            <div className='contentContainer'>
                <Header />
                <Outlet />
                <Footer />
            </div>
        </div>
    )
}
