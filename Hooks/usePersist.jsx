import { useMemo, useState, useEffect } from "react";

export default function usePersist(initialValueArg, id) {
    const initialValue = useMemo(() => {
        const sessionStorageValue = sessionStorage.getItem(id);
        if (sessionStorageValue) {
            return JSON.parse(sessionStorageValue);
        }
        return initialValueArg;
    }, [initialValueArg, id]);

    const [state, setState] = useState(initialValue);

    useEffect(() => {
        sessionStorage.setItem(id, JSON.stringify(state));
    }, [state, id]);

    return [ state, setState ];
}