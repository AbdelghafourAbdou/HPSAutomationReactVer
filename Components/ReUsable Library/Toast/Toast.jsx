import { useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import checkCircle from '/checkCircle.svg';
import exclamationTriangle from '/exclamationTriangle.svg';
import exclamationCircle from '/exclamationCircle.svg';
import infoCircle from '/infoCircle.svg';
import xCircle from '/xCircle.svg';
import useDisappear from "../../../Hooks/useDisappear";
import './Toast.css';

export default function Toast({ children, className, event, delay, ...rest }) {
    const [title, description] = children;
    const containerRef = useRef();
    const [display, disappear] = useDisappear(containerRef, delay);

    let renderedIcon;
    switch (event) {
        case 'success':
            renderedIcon = <img src={checkCircle} alt="check circle icon" className='checkCircle' />;
            break;
        case 'warning':
            renderedIcon = <img src={exclamationTriangle} alt="exclamation triangle icon" className='exclamationTriangle' />;
            break;
        case 'error':
            renderedIcon = <img src={exclamationCircle} alt="exclamation circle icon" className='exclamationCircle' />
            break;
        case 'information':
            renderedIcon = <img src={infoCircle} alt="information circle icon" className='infoCircle' />;
            break;

        default:
            throw new Error("Unknown Event, please choose one of the following events: success, error, warning, or information");
    }

    const finalClassName = classNames('toast-container', event, 'bottom-right-corner', 'animate__animated', 'animate__backInUp', className);

    return (
        display && createPortal(
            <div ref={containerRef} className={finalClassName} {...rest}>
                {renderedIcon}
                <div className='toast-text-content'>
                    <div className={`toast-title ${event}-title`}>
                        {title.props.children}
                    </div>
                    <div className={`toast-description ${event}-description`}>
                        {description.props.children}
                    </div>
                </div>
                <button className='toastButton' onClick={disappear}>
                    <img src={xCircle} alt="cross circle icon" className='xCircle' />
                </button>
            </div>,
            document.getElementById('root'))
    );
}
