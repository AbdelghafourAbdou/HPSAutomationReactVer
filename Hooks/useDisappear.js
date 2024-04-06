import { useState, useEffect } from 'react'

export default function useDisappear(element, timeDelay = 0) {
    const [display, setDisplay] = useState(true);

    timeDelay && useEffect(() => {
        const selectedElement = element.current;
        const animationTimeoutId = setTimeout(() => {
            selectedElement.classList.remove('animate__backInUp');
            selectedElement.classList.add('animate__backOutDown');
        }, +timeDelay);
        const displayTimeoutId = setTimeout(() => {
            setDisplay(false);
        }, (+timeDelay) + 1000);

        return () => {
            clearTimeout(displayTimeoutId);
            clearTimeout(animationTimeoutId);
        }
    }, []);

    function disappear() {
        setDisplay(false);
    }

    return [display, disappear];
}