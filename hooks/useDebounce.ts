import { useEffect, useState } from 'react';

/**
 * Returns a debounced version of `value` that only updates
 * after the user has stopped changing it for `delay` ms.
 * Use this to avoid firing an API call on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 400): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
