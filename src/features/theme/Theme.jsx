// src/features/counter/Theme.jsx
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

function Theme() {
    const currentTheme = useSelector((state) => state.theme);
    const previousThemeClass = useRef(); // Move useRef outside useEffect

    useEffect(() => {
        // Remove the previous theme class, if any
        if (previousThemeClass.current) {
            document.body.classList.remove(previousThemeClass.current);
        }

        // Add the current theme class to the body
        if (currentTheme) {
            document.body.classList.add(currentTheme);
            // Update the ref to the new theme class
            previousThemeClass.current = currentTheme;
        }
    }, [currentTheme]);

    return null;
}

export default Theme;
