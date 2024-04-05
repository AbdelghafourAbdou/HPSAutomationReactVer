/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom';
import './Link.css';

const Link = ({ open, children }) => {
    const [id, to, name] = children;

    let rendered;
    if (open[`isb${Number(id) + 1}Open`]) {
        if (typeof name === 'string') {
            rendered =
                <NavLink
                    to={to}
                    className={({ isActive }) => isActive ? "activeLink" : null}
                >{name}</NavLink>;
        } else {
            rendered = name.map((title, index) =>
                <NavLink
                    key={index}
                    to={to[index]}
                    className={({ isActive }) => isActive ? "activeLink" : null}
                >{title}</NavLink>);
        }
    } else rendered = null;

    return (
        <div className='linksContainer'>
            {rendered}
        </div>
    )
}

export default Link;