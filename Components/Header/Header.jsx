import {} from 'react'
import './Header.css'
import logo from '../../src/assets/logo.png'

export default function Header() {
    return (
        <div className='header'>
            <img src={logo} alt='HPS Logo' />
        </div>
    )
}
