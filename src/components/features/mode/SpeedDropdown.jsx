// src/features/speed/SpeedDropdown.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCarouselSpeed } from '../../../store/speedSlice';
import Dropdown from '../../components/Dropdown';

const speedOptions = [
    { value: 'slower', label: 'Slower' },
    { value: 'classic', label: 'Classic' },
    { value: 'faster', label: 'Faster' },
];

function SpeedDropdown() {
    const dispatch = useDispatch();
    const currentSpeed = useSelector((state) => state.carouselSpeed);

    const handleSpeedSelect = (speed) => {
        dispatch(setCarouselSpeed(speed));
    };

    return (
        <div className="mb-4">
            <Dropdown
                options={speedOptions}
                onSelect={handleSpeedSelect}
                label="Select Carousel Speed"
                selectedValue={currentSpeed}
            />
        </div>
    );
}

export default SpeedDropdown;
