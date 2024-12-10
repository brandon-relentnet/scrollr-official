// src/components/Dropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Dropdown({
    options,
    onSelect,
    label,
    selectedValue = '',
    onBlur = null,
    onClose = null, // New onClose prop
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (value) => {
        onSelect(value);
        setIsOpen(false);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (isOpen) {
                    setIsOpen(false);
                    if (onClose && !selectedValue) {
                        onClose();
                    }
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, selectedValue]);

    // Ensure both option.value and selectedValue are strings for comparison
    const selectedOption = options.find(option => String(option.value) === String(selectedValue));

    return (
        <div className='w-full mx-auto relative' ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-left bg-surface1 text-text shadow rounded flex justify-between items-center hover:bg-surface2"
            >
                <span>{selectedOption ? selectedOption.label : label}</span>
                <svg
                    className={`w-4 h-4 text-text ml-2 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            <div
                className={`absolute mt-2 w-full bg-surface2 z-10 rounded shadow-lg transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-48 overflow-y-auto' : 'max-h-0 overflow-hidden'}`}
                style={{ maxHeight: isOpen ? '12rem' : '0' }}
            >
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`block w-full text-left px-4 py-2 cursor-pointer ${String(option.value) === String(selectedValue) ? 'bg-accent text-surface0 font-semibold' : 'text-subtext0 hover:bg-overlay0 hover:text-text'}`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

Dropdown.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onBlur: PropTypes.func,
    onClose: PropTypes.func,
};

export default Dropdown;
