import {} from 'react'
import './Footer.css'

export default function Footer() {
    let year = new Date().getFullYear();
    return (
        <div className='footer'>
            © {year} Copyright: HPS
        </div>
    )
}
