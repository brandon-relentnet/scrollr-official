// src/features/counter/Accent.jsx
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

function Accent() {
    const currentAccent = useSelector((state) => state.accent);
    const previousAccentClass = useRef(); // Move useRef outside useEffect

    useEffect(() => {
        // Remove the previous accent class, if any
        if (previousAccentClass.current) {
            document.body.classList.remove(previousAccentClass.current);
        }

        // Add the current accent class to the body
        if (currentAccent) {
            document.body.classList.add(currentAccent);
            document.body.style.setProperty('--accent', `var(--${currentAccent})`);
            // Update the ref to the new accent class
            previousAccentClass.current = currentAccent;
        }
    }, [currentAccent]);

    return null;
}

export default Accent;
