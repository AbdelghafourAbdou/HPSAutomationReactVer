import { useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { BiCheckCircle } from "react-icons/bi";
import { VscWarning } from "react-icons/vsc";
import { BiErrorCircle } from "react-icons/bi";
import { IoIosInformationCircle } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import useDisappear from "../../../Hooks/useDisappear"
import './Toast.css';

export default function Toast({ children, className, event, delay, ...rest }) {
    const [title, description] = children;
    const containerRef = useRef();
    const [display, disappear] = useDisappear(containerRef, delay);

    let renderedIcon;
    switch (event) {
        case 'success':
            renderedIcon = <BiCheckCircle size='1.5em' color='#34D399' />;
            break;
        case 'warning':
            renderedIcon = <VscWarning size='1.5em' color='#FBBF24' />;
            break;
        case 'error':
            renderedIcon = <BiErrorCircle size='1.5em' color='#F87171' />;
            break;
        case 'information':
            renderedIcon = <IoIosInformationCircle size='1.5em' color='#60A5FA' />;
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
                    <TiDelete size='1.5em' color='#6B7280' />
                </button>
            </div>, 
            document.getElementById('root'))
    );
}
