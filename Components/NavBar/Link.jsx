/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom';
import './Link.css';

const Link = ({ open, children }) => {
    const [ id, to, name] = children;

    let rendered;
    if (open[id]) {
        if (typeof name === 'string') {
            rendered = <NavLink to={to}>{name}</NavLink>;
        } else {
            rendered = name.map((title, index) => <NavLink key={index} to={to[index]}>{title}</NavLink>);
        }
    } else rendered = null;

    return (
        <div className='linksContainer'>
            {rendered}
        </div>
    )
}

export default Link;